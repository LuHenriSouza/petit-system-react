import { Autocomplete, Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { LayoutMain } from '../../shared/layouts';
import { VForm } from '../../shared/forms/VForm';
import { VSelect } from '../../shared/forms/VSelect';
import { VTextField } from '../../shared/forms/VTextField';
import { useEffect, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { ProductService } from '../../shared/services/api';
import { EProdOutReason } from '../outflow/enum/EProdOutReason';

// const OUTFLOW_ROW_LIMIT = 6;
// const NUMBER_OF_SKELETONS = Array(OUTFLOW_ROW_LIMIT).fill(null);

export const ProductOutput: React.FC = () => {
	const [selectedProd, setSelectedProd] = useState(0);
	const [selectedProdName, setSelectedProdName] = useState('');
	const [allProducts, setAllProducts] = useState<{ label: string, id: number }[]>();
	// const [errorSelect, setErrorSelect] = useState(false);

	const reasons = [
		{ text: 'Consumo', value: EProdOutReason.Consumo },
		{ text: 'Vencido', value: EProdOutReason.Vencimento },
		{ text: 'Impróprio p/ Consumo', value: EProdOutReason.Improprio }
	];

	const handleSubmit = () => {

	}
	const formRef = useRef<FormHandles>(null);
	useEffect(() => {
		getAllProducts();
	}, [])
	const getAllProducts = async () => {
		const response = await ProductService.getAll(1, '', 999999999);
		if (response instanceof Error) {
			alert('ocorreu algum erro')
		}
		else {
			const dataFilter = response.data.map((prod) => { return { label: prod.name, id: prod.id } });
			setAllProducts(dataFilter);
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
										{/* {
										!loading ? rows.map(
											(row, index) => {
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
											}
										)
											:
											NUMBER_OF_SKELETONS.map((_, index) => (
												<TableRow key={index}>
													<TableCell >
														<Skeleton sx={{ minHeight: 40, maxWidth: 80 }} />
													</TableCell>
													<TableCell >
														<Skeleton sx={{ minHeight: 40, maxWidth: 50 }} />
													</TableCell>
													<TableCell >
														<Skeleton sx={{ minHeight: 40, maxWidth: 80 }} />
													</TableCell>
													<TableCell >
														<Fab disabled size='medium'></Fab>
													</TableCell>
												</TableRow>
											))
									} */}
									</TableBody>
									{/* {totalCount === 0 && !loading && (
									<caption>Nenhuma saída registrada</caption>
								)} */}
								</Table>
							</TableContainer>
						</Box>
						{/* {totalCount > 0 && (
						<Pagination
							sx={{ m: 1 }}
							disabled={loadingPage}
							page={Number(page)}
							count={Math.ceil(totalCount / OUTFLOW_ROW_LIMIT)}
							onChange={(_, newPage) => setSearchParams({ page: newPage.toString() }, { replace: true })}
							siblingCount={0}
						/>
					)} */}
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						<Typography variant="h5" sx={{ m: 2 }}>Nova Saída:</Typography>
						<VForm ref={formRef} onSubmit={handleSubmit} placeholder={''}>
							<Box display={'flex'} flexDirection={'column'} gap={3} margin={3}>
								<Box display={'flex'} gap={5}>
									<Box width={200}>
										<Autocomplete
											id="combo-box"
											value={{ label: selectedProdName, id: selectedProd }}
											options={allProducts ?? []}
											sx={{ width: 300 }}
											renderOption={(props, option) => {
												return (
													<li {...props} key={option.id}>
														{option.label}
													</li>
												);
											}}
											renderInput={(params) => <TextField {...params} label="Produto" />}
											onChange={(_, newValue) => {
												if (newValue) {
													setSelectedProd(newValue.id);
													setSelectedProdName(newValue.label);
												} else { setSelectedProd(0); setSelectedProdName(''); }

												// setErrorSelect(false);
											}}
										/>
									</Box>
								</Box>
								<VTextField
									label={'Quantidade'}
									onChange={undefined}
									name="0.05"
									sx={{ maxWidth: 120 }}
									inputProps={{ type: 'number' }}
									autoComplete="off"
								/>
								<Box width={220}>
									<VSelect label='Motivo' name='reason' menuItens={reasons} />
								</Box>
								<VTextField
									name="desc"
									rows={4}
									fullWidth
									multiline
									label="Descrição"
									id="elevation-multiline-static"
									autoComplete="off"
								/>
								<Button variant="contained" onClick={() => formRef.current?.submitForm()}
								// disabled={loadingPageSubmit}
								>Confirmar</Button>
							</Box>
						</VForm>
					</Paper>
				</Grid>
			</Grid>
		</LayoutMain >
	)
};