import { Form } from '@unform/web'
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { VTextField } from '../../shared/forms/VTextField';
import { VSelect, IMenuItens } from '../../shared/forms/VSelect';
import { useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { ProductService } from '../../shared/services/api';
import * as yup from 'yup';
import Swal from 'sweetalert2'
import './../../shared/css/sweetAlert.css'

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


export const NewProduct: React.FC = () => {
	const inputCode = useRef<HTMLInputElement>(null);
	const inputName = useRef<HTMLInputElement>(null);
	const inputPrice = useRef<HTMLInputElement>(null);
	const formRef = useRef<FormHandles>(null);

	const [querryError, setQuerryError] = useState(false);

	const handleKeyDownCode = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.code === 'Enter' || e.key === 'Enter') inputName.current?.focus();
		setQuerryError(false);
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
			const result = await ProductService.create(dataValidated);

			if (result instanceof Error) {
				setQuerryError(true);
				inputCode.current?.focus();
			} else {
				setQuerryError(false);
				Swal.fire({
					icon: "success",
					title: "Produto cadastrado com sucesso!",
					showConfirmButton: false,
					timer: 1500,
					didClose() {
						formRef.current?.setFieldValue('code', '');
						formRef.current?.setFieldValue('name', '');
						formRef.current?.setFieldValue('sector', 0);
						formRef.current?.setFieldValue('price', 'R$ 0.00');
						inputCode.current?.focus();
					},
				});



			}
		} catch (errors) {
			if (errors instanceof yup.ValidationError) {
				const validatenErrors: { [key: string]: string } = {};
				errors.inner.forEach((e) => {
					if (!e.path) return;
					validatenErrors[e.path] = e.message;
				});
				if (inputCode.current) {
					inputCode.current.value = '';
				}

				if (inputName.current) {
					inputName.current.value = '';
				}

				if (inputPrice.current) {
					inputPrice.current.value = '';
				}
				formRef.current?.setErrors(validatenErrors)
				return;
			}
			setQuerryError(true);
		}

	};

	return (
		<>
			<LayoutMain title="Novo Produto" subTitle="Cadastre um Produto">
				<Paper component={Paper} variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
					<Typography variant={'h5'} sx={{ my: 3, ml: 1 }}>Dados:</Typography>
					{(querryError && <Alert severity="error">Já existe um produto com este código !</Alert>)}
					<Form
						onSubmit={handleSubmit}
						placeholder={''}
						ref={formRef}
					>
						<Box display={'flex'} flexDirection={'column'} gap={3} sx={{ mt: 2 }}>
							<Box width={180}>
								<VTextField name='code' label={'Código'} onKeyDown={e => handleKeyDownCode(e)} autoComplete="off" inputRef={inputCode} />
							</Box>
							<Box width={300}>
								<VTextField name='name' label={'Nome'} inputRef={inputName} onKeyDown={e => handleKeyDownName(e)} autoComplete="off" />
							</Box>
							<Box width={200}>
								<VSelect name='sector' label='Setor' menuItens={selectManuItens} />
							</Box>
							<Box width={180}>
								<VTextField
									name='price'
									label={'Preço'}
									inputRef={inputPrice}
									onKeyDown={e => handleKeyDownPrice(e)}
									autoComplete="off"
									valueDefault='R$ 0.00'
									cash
								/>
							</Box>
						</Box>
						<Button type='button' variant='contained' size={'large'} sx={{ my: 1, mt: 3 }} onClick={() => formRef.current?.submitForm()}>Cadastrar</Button>
					</Form>
				</Paper >
			</LayoutMain >
		</>
	);
};