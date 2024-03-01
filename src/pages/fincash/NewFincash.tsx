import * as yup from 'yup';
import Swal from 'sweetalert2'
import { FormHandles } from '@unform/core';
import { useNavigate } from "react-router-dom";
import { VForm } from "../../shared/forms/VForm";
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useRef, useState } from "react";
import { VTextField } from "../../shared/forms/VTextField";
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { FincashService, IFincash } from "../../shared/services/api";
import { Box, Button, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";


interface IFormDataValidated {
    opener: string;
    value: number;
}

interface IFormData {
    opener: string;
    value: string;
    obs: string;
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

    const inputRefValue = useRef<HTMLInputElement>();
    const formRef = useRef<FormHandles>(null);

    useEffect(() => {

        const fetchData = async () => {
            const result = await FincashService.getOpenFincash();
            setOpenFincash(result);

            const lastFincash = await FincashService.getLastFincash();
            if (!(lastFincash instanceof Error))
                formRef.current?.setFieldValue('value', `R$ ${lastFincash.finalValue}`);
        }
        if (!smDown) {
            fetchData();
        } else {
            alert('Essa tela não funciona em smartphones')
            navigate('/');
        }
    }, [att, navigate, smDown]);

    if (!(openFincash instanceof Error)) {
        navigate('/caixa');
    }

    const handleSubmit = async (data: IFormData) => {
        try {
            const getNumbers = data.value.split(' ');
            data.value = getNumbers[1];
            data.obs = data.obs.trim();
            const dataValidated = await formValidation.validate(data, { abortEarly: false });

            Swal.fire({
                title: 'Tem Certeza?',
                allowEnterKey: false,
                text: `Abir Caixa com ${data.value} ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: theme.palette.primary.main,
                cancelButtonColor: '#aaa',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            }).then(async (confirm) => {
                if (confirm.isConfirmed) {
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
                }
            });
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
    const handleKeyDownName = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter' || e.key === 'Enter') inputRefValue.current?.focus();
    }

    const handleKeyDownValue = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter' || e.key === 'Enter') formRef.current?.submitForm();
    }

    return (

        <LayoutMain title="Novo Caixa" subTitle="Abrir um novo caixa">
            <Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
                <Typography variant={'h5'} sx={{ my: 3, ml: 1 }}>Dados:</Typography>
                <VForm onSubmit={handleSubmit} placeholder={''} ref={formRef}>
                    <Box display={'flex'} flexDirection={'column'} marginBottom={4} maxWidth={900}>
                        <Box display={'flex'} gap={7} >
                            <Box width={300}>
                                <VTextField label={'Nome'} name="opener" onKeyDown={handleKeyDownName} tabIndex={901} />
                            </Box>
                            <Box width={300}>
                                <VTextField label={'Valor'} name="value" valueDefault="R$ 0.00" cash inputRef={inputRefValue} onKeyDown={handleKeyDownValue} tabIndex={902} />
                            </Box>
                            <Button variant="contained" size="large" sx={{ width: 120 }} onClick={() => formRef.current?.submitForm()} tabIndex={904}><OpenInBrowserIcon sx={{ mr: 1 }} />Abrir</Button>
                        </Box>
                        <Box >
                            <VTextField
                                rows={4}
                                fullWidth
                                multiline
                                name={'obs'}
                                sx={{ mt: 2 }}
                                label="Observações"
                            />
                        </Box>
                    </Box>

                </VForm>
            </Paper>
        </LayoutMain>
    );
};