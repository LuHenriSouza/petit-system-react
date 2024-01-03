import { Form } from '@unform/web'
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { VTextField } from '../../shared/forms/VTextField';
import { VSelect, IMenuItens } from '../../shared/forms/VSelect';
import { useEffect, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { IProduct, ProductService } from '../../shared/services/api';
import * as yup from 'yup';
import Swal from 'sweetalert2'
import './../../shared/css/sweetAlert.css'
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';

const selectManuItens: IMenuItens[] = [
    { text: '1 - Bebidas', value: '1' },
    { text: '2 - Chocolates', value: '2' },
    { text: '3 - Salgadinhos', value: '3' },
    { text: '4 - Sorvetes', value: '4' }
];

interface IFormDataValidated {
    code: string;
    name: string;
    sector: number;
    price: number;
}

interface IFormData {
    code: string;
    name: string;
    sector: number;
    price: string;
}


const formValidation: yup.Schema<IFormDataValidated> = yup.object().shape({
    code: yup.string().required().min(1).max(20),
    name: yup.string().required().min(3).max(50),
    sector: yup.number().required().min(1).max(4),
    price: yup.number().required().min(0),
});


export const UpdateProduct: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState<IProduct | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await ProductService.getById(Number(id));
                if (result instanceof Error) return 'not found';
                setData(result);
            } catch (e) {
                console.log(e);
            }

        }

        fetchData();
    });


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputName = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputPrice = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const formRef = useRef<FormHandles>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [querryError, setQuerryError] = useState(false);

    const handleKeyDownCode = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter' || e.key === 'Enter') inputName.current?.focus();

    };

    const handleKeyDownName = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter' || e.key === 'Enter') inputPrice.current?.focus();
    };

    const handleKeyDownPrice = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter' || e.key === 'Enter') formRef.current?.submitForm();
    };

    const handleSubmit = async (data: IFormData) => {
        try {
            const getNumbers = data.price.split(' ');
            data.price = getNumbers[1];
            const dataValidated = await formValidation.validate(data, { abortEarly: false })
            const result = await ProductService.updateById(Number(id), dataValidated);

            if (result instanceof Error) {
                setQuerryError(true);
            } else {
                setQuerryError(false);
                Swal.fire({
                    icon: "success",
                    title: "Produto editado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/produtos');
            }
        } catch (errors) {
            if (errors instanceof yup.ValidationError) {
                const validatenErrors: { [key: string]: string } = {};
                errors.inner.forEach((e) => {
                    if (!e.path) return;
                    validatenErrors[e.path] = e.message;
                });

                formRef.current?.setErrors(validatenErrors)
                return;
            }
            setQuerryError(true);
        }
    }
    const defaultPrice = `R$ ${data?.price}`
    return (
        <>
            {(data ?
                <LayoutMain title="Editar Produto" subTitle="Edite um Produto">
                    <Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }} variant="elevation">
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Link to={'/produtos'}>
                                <Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
                            </Link>
                        </Box>
                    </Paper>
                    <Paper  variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
                        <Typography variant={'h5'} sx={{ my: 3, ml: 1 }}>Dados:</Typography>
                        {(querryError && <Alert severity="error">Já existe um produto com este código !</Alert>)}
                        <Form
                            onSubmit={handleSubmit}
                            placeholder={''}
                            ref={formRef}
                        >
                            <Box display={'flex'} flexDirection={'column'} gap={3} sx={{ mt: 2 }}>
                                <Box width={180}>
                                    <VTextField sx={{ backgroundColor: '#eee' }} name='code' label={'Código'} onKeyDown={e => handleKeyDownCode(e)} autoComplete="off" valueDefault={data.code} inputProps={{
                                        readOnly: Boolean(true)
                                    }} />
                                </Box>
                                <Box width={300}>
                                    <VTextField name='name' label={'Nome'} inputRef={inputName} onKeyDown={e => handleKeyDownName(e)} autoComplete="off" valueDefault={data.name} />
                                </Box>
                                <Box width={200}>
                                    <VSelect name='sector' label='Setor' menuItens={selectManuItens} defaultSelected={data.sector} messageError='Setor não pode ser vazio'/>
                                </Box>
                                <Box width={180}>
                                    <VTextField
                                        name='price'
                                        label={'Preço'}
                                        inputRef={inputPrice}
                                        onKeyDown={e => handleKeyDownPrice(e)}
                                        autoComplete="off"
                                        valueDefault={defaultPrice}
                                    />
                                </Box>
                            </Box>
                            <Button type='button' variant='contained' size={'large'} sx={{ my: 1, mt: 3 }} onClick={() => formRef.current?.submitForm()}>Cadastrar</Button>
                        </Form>
                    </Paper >
                </LayoutMain >
                :
                <h2>Erro ao achar produto!</h2>
            )}
        </>
    );
};