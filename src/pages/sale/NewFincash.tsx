import { Box, Button, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useRef, useState } from "react";
import { FincashService, IFincash } from "../../shared/services/api";
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core';
import { VTextField } from "../../shared/forms/VTextField";
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import Swal from 'sweetalert2'


interface IFormDataValidated {
    opener: string;
    value: number;
}

interface IFormData {
    opener: string;
    value: string;
}


const formValidation: yup.Schema<IFormDataValidated> = yup.object().shape({
    opener: yup.string().required().min(3).max(50),
    value: yup.number().required().min(0),
});


export const NewFincash: React.FC = () => {
    const [att, setAtt] = useState(0);
    const [openFincash, setOpenFincash] = useState<Error | IFincash>(Error);
    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();

    const formRef = useRef<FormHandles>(null);

    useEffect(() => {

        const fetchData = async () => {
            const result = await FincashService.getOpenFincash();
            setOpenFincash(result);
        }
        if (!smDown) {
            fetchData();
        } else {
            alert('Essa tela não funciona em smartphones')
            navigate('/');
        }
    }, [att]);

    if (!(openFincash instanceof Error)) {
        navigate('/caixa');
    }

    const handleSubmit = async (data: IFormData) => {
        try {
            const getNumbers = data.value.split(' ');
            data.value = getNumbers[1];
            const dataValidated = await formValidation.validate(data, { abortEarly: false })
            const result = await FincashService.create(dataValidated);
            console.log(result);
            if (!(result instanceof Error)) {
                Swal.fire({
                    icon: "success",
                    title: "Caixa aberto com sucesso!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setAtt(1);

            }

        } catch (errors) {
            console.log(errors);

            if (errors instanceof yup.ValidationError) {
                console.log('inner yup' + errors);

                const validatenErrors: { [key: string]: string } = {};
                errors.inner.forEach((e) => {
                    if (!e.path) return;
                    validatenErrors[e.path] = e.message;
                });
                formRef.current?.setErrors(validatenErrors)
                return;
            }
        }
    };

    return (

        <LayoutMain title="Novo Caixa" subTitle="Abrir um novo caixa">
            <Paper  variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
                <Typography variant={'h5'} sx={{ my: 3, ml: 1 }}>Dados:</Typography>
                <Form onSubmit={handleSubmit} placeholder={''} ref={formRef}>
                    <Box display={'flex'} gap={7} marginBottom={4}>
                        <Box width={300}>
                            <VTextField label={'Nome'} name="opener" />
                        </Box>
                        <Box width={300}>
                            <VTextField label={'Valor'} name="value" valueDefault="R$ 0.00" cash />
                        </Box>
                        <Button variant="contained" size="large" sx={{ width: 120 }} onClick={() => formRef.current?.submitForm()}><OpenInBrowserIcon sx={{ mr: 1 }} />Abrir</Button>
                    </Box>
                </Form>
            </Paper>
        </LayoutMain>
    );
};