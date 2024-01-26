import {
	Fab,
	Box,
	Grid,
	Table,
	Paper,
	Button,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	Pagination,
	Typography,
	TableContainer,
} from "@mui/material";
import * as yup from 'yup';
import Swal from 'sweetalert2';
import './../../shared/css/sweetAlert.css'
import { FormHandles } from '@unform/core';
import { VForm } from "../../shared/forms/VForm";
import { LayoutMain } from "../../shared/layouts";
import { EOutflowType } from "./enum/EOutflowType";
import { Environment } from "../../shared/environment";
import { VTextField } from "../../shared/forms/VTextField";
import { useEffect, useMemo, useRef, useState } from "react";
import { IMenuItens, VSelect } from "../../shared/forms/VSelect";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { FincashService, ICashOutflow, IFincash, OutflowService, SupplierService } from "../../shared/services/api";



const selectManuItens: IMenuItens[] = [
	{ text: 'Alimentação', value: EOutflowType.Alimentacao },
	{ text: 'Transporte', value: EOutflowType.Transporte },
	{ text: 'Fornecedor', value: EOutflowType.Fornecedor },
	{ text: 'Sangria', value: EOutflowType.Sangria },
	{ text: 'Outro', value: EOutflowType.Outro }
];

interface IFormData {
	type: EOutflowType;
	fincash_id: number;
	value: string;
	supplier_id?: number | null;
	desc?: string | null;
}

interface IFormDataValidatedNoSupplier {
	type: EOutflowType;
	fincash_id: number;
	value: number;
	desc?: string | null;
}

interface IFormDataValidatedSupplier {
	type: EOutflowType;
	fincash_id: number;
	value: number;
	supplier_id: number;
	desc?: string | null;
}

const formValidationNoSupplier: yup.Schema<IFormDataValidatedNoSupplier> = yup.object().shape({
	type: yup.mixed<EOutflowType>().required().oneOf(Object.values(EOutflowType)),
	fincash_id: yup.number().required().moreThan(0),
	value: yup.number().required().moreThan(0),

	desc: yup.string().nullable().max(200),
});

const formValidationSupplier: yup.Schema<IFormDataValidatedSupplier> = yup.object().shape({
	type: yup.mixed<EOutflowType>().required().oneOf(Object.values(EOutflowType)),
	fincash_id: yup.number().required().moreThan(0),
	value: yup.number().required().moreThan(0),

	supplier_id: yup.number().required(),
	desc: yup.string().nullable().max(200),
});

export const OutFlow: React.FC = () => {

	const navigate = useNavigate();
	const formRef = useRef<FormHandles>(null);
	const [totalCount, setTotalCount] = useState(0);
	const [rows, setRows] = useState<ICashOutflow[]>([]);
	const [fincash, setFincash] = useState<IFincash>();
	const [isSupplier, setIsSupplier] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const [suppliers, setSuppliers] = useState<IMenuItens[]>([]);
	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);

	useEffect(() => {
		const fetchData = async () => {
			const fincashFetch = await FincashService.getOpenFincash();
			if (fincashFetch instanceof Error) {
				Swal.fire({
					icon: "error",
					title: "Erro",
					text: "Nenhum caixa aberto encontrado!",
					showConfirmButton: true,
				});
				navigate('/caixa/novo');
			} else {
				setFincash(fincashFetch)
				listOutflows(fincashFetch)
			}
		}

		fetchData()
	}, [page]);

	const listOutflows = async (fincashData: IFincash) => {
		if (fincashData) {
			await OutflowService.getAllById(Number(page), fincashData.id)
				.then((result) => {
					if (result instanceof Error) {
						alert(result.message);
					} else {
						setTotalCount(result.totalCount);
						setRows(result.data);
					}
				});
		}
	};

	const handleValueChange = async (selectedValue: string) => {
		if (selectedValue === EOutflowType.Fornecedor) {

			setIsSupplier(true);
			try {
				if (suppliers.length <= 0) {
					const result = await SupplierService.getAll(undefined, undefined, 99999)
					if (result instanceof Error) {
						alert('Erro ao buscar Fornecedores');
					} else {
						result.data.map((data) => {
							const object = { text: data.name, value: `${data.id}` }
							setSuppliers((old) => [...old, object]);
						})
					}
				}

			} catch (e) {
				alert(e);
			}
		} else {
			setIsSupplier(false);
		}
	};

	const handleSubmit = async (data: IFormData) => {
		if (fincash) {
			try {
				const getNumbers = data.value.split(' ');
				data.value = getNumbers[1];
				data.fincash_id = fincash.id;
				const dataValidated = isSupplier ?
					await formValidationSupplier.validate(data, { abortEarly: false })
					:
					await formValidationNoSupplier.validate(data, { abortEarly: false })

				const result = await OutflowService.create(dataValidated);

				if (result instanceof Error) {
					alert(result)
				} else {
					Swal.fire({
						icon: "success",
						title: "Sucesso",
						text: "Saída cadastrada com sucesso!",
						showConfirmButton: true,
					});
					formRef.current?.setFieldValue('type', '');
					formRef.current?.setFieldValue('supplier_id', 0);
					formRef.current?.setFieldValue('value', 'R$ 0.00');
					formRef.current?.setFieldValue('desc', '');
					setIsSupplier(false);
					listOutflows(fincash);
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
			}
		} else {
			Swal.fire({
				icon: "error",
				title: "Erro",
				text: "Nenhum caixa aberto encontrado!",
				showConfirmButton: true,
			});
		}
	}

	return (
		<LayoutMain title="Saidas" subTitle="Adicione saídas ao caixa">
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						<Typography variant="h5" sx={{ m: 2 }}>Saídas:</Typography>
						<Box minHeight={550}>
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Descrição</TableCell>
											<TableCell>Valor</TableCell>
											<TableCell>Tipo</TableCell>
											<TableCell>Ações</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										{rows.map((row, index) => {
											return (
												<TableRow key={index}>
													<TableCell >
														<Typography noWrap overflow="hidden" textOverflow="ellipsis" maxWidth={100}>
															{row.desc}
														</Typography>
													</TableCell>
													<TableCell>R$ {row.value}</TableCell>
													<TableCell>{row.type}</TableCell>
													<TableCell>
														<Link to={'/saidas/' + row.id}>
															<Fab
																size="medium"
																color="info"
																onClick={() => console.log('Clique no ícone')}
																sx={{
																	backgroundColor: '#5bc0de',
																	'&:hover': { backgroundColor: '#6fd8ef' },
																}}
															>
																<VisibilityRoundedIcon color="info" />
															</Fab>
														</Link>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
									{totalCount === 0 && (
										<caption>Nenhuma saída registrada</caption>
									)}
								</Table>
							</TableContainer>
						</Box>
						{(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
							<TableRow>
								<TableCell colSpan={3}>
									<Pagination
										page={Number(page)}
										count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
										onChange={(_, newPage) => setSearchParams({ page: newPage.toString() }, { replace: true })}
										siblingCount={0}
									/>
								</TableCell>
							</TableRow>
						)}
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						<Typography variant="h5" sx={{ m: 2 }}>Nova Saída:</Typography>
						<VForm ref={formRef} onSubmit={handleSubmit} placeholder={''}>
							<Box display={'flex'} flexDirection={'column'} gap={3} margin={3}>
								<Box display={'flex'} gap={5}>
									<Box width={200}>
										<VSelect
											name="type"
											label="Tipo"
											menuItens={selectManuItens}
											onValueChange={handleValueChange}
											messageError="Tipo não pode ser vazio"
										/>
									</Box>
									{isSupplier &&
										<Box width={300}>
											<VSelect
												name="supplier_id"
												label="Fornecedor"
												menuItens={suppliers.length > 0 ? suppliers : [{ text: "Nenhum fornecedor cadastrado", value: "" }]}
												messageError="Fornecedor não pode ser vazio"
											/>
										</Box>
									}
								</Box>
								<VTextField name="value" label="Valor" valueDefault="R$ 0.00" cash sx={{ maxWidth: 170 }} autoComplete="off" />
								<VTextField
									name="desc"
									rows={4}
									fullWidth
									multiline
									label="Descrição"
									id="elevation-multiline-static"
									autoComplete="off"
								/>
								<Button variant="contained" onClick={() => formRef.current?.submitForm()}>Confirmar</Button>
							</Box>
						</VForm>
					</Paper>
				</Grid>
			</Grid>
		</LayoutMain >
	);
};