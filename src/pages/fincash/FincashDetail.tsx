import {
	Fab,
	Box,
	Table,
	Paper,
	Button,
	TableRow,
	Skeleton,
	TableCell,
	TextField,
	TableBody,
	Typography,
	Pagination,
} from "@mui/material";
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { format } from "date-fns";
import './../../shared/css/sweetAlert.css';
import { FormHandles } from "@unform/core";
import AddIcon from "@mui/icons-material/Add";
import { VForm } from "../../shared/forms/VForm";
import { LayoutMain } from "../../shared/layouts";
import HistoryIcon from '@mui/icons-material/History';
import { VTextField } from "../../shared/forms/VTextField";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { FincashService, ICashOutflow, IFincash, OutflowService } from "../../shared/services/api";

const OUTFLOW_ROW_LIMIT = 5;

export const FincashDetail: React.FC = () => {
	const { id } = useParams();
	const [desc, setDesc] = useState('');

	const [loading, setLoading] = useState(true);
	const [cardLoading, setCardLoading] = useState(false);
	const [reload, setReload] = useState(0);
	const [fincash, setFincash] = useState<IFincash>();
	const [outflows, setOutflows] = useState<{ outflows: ICashOutflow[], total: number }>();

	const formRef = useRef<FormHandles>(null);

	const [outflowTotalCount, setOutflowTotalCount] = useState(0);
	const [loadingOutflows, setLoadingoutflows] = useState(false);

	const [searchParams, setSearchParams] = useSearchParams();

	const outflowPage = useMemo(() => {
		return searchParams.get('outflowPage') || 1;
	}, [searchParams]);

	useEffect(() => {
		if (fincash) {
			listOutflow(fincash.id);
		}
	}, [outflowPage, fincash]);

	useEffect(() => {
		const fetchData = async () => {
			try {

				const CompleteFetch = await FincashService.getDetailedData(Number(id));
				if (CompleteFetch instanceof Error) return 'Fincash not found';
				const fincash = CompleteFetch.data.data.fincash;
				fincash.obs && setDesc(fincash.obs);
				if (!fincash.isFinished) {
					const result = await FincashService.getTotalByFincash(fincash.id);
					if (!(result instanceof Error)) {
						fincash.totalValue = result;
					}
				}
				if (fincash.finalValue == null) fincash.finalValue = 0;
				if (fincash.totalValue == null) fincash.totalValue = 0;
				if (fincash.cardValue == null) fincash.cardValue = 0;
				setFincash(fincash);

			} catch (e) {

				console.log(e);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [reload]);

	const listOutflow = async (fincash_id: number) => {
		// OUTFLOW
		try {
			setLoadingoutflows(true);
			const outflows = await OutflowService.getAllById(Number(outflowPage), fincash_id, OUTFLOW_ROW_LIMIT);
			if (outflows instanceof Error) return 'Outflows not found';
			const getTotal = await OutflowService.getTotalByFincash(fincash_id);
			if (!(getTotal instanceof Error)) {
				const total = Number(getTotal);
				setOutflows({ outflows: outflows.data, total });
				setOutflowTotalCount(outflows.totalCount);
			}
		} catch (e) { console.error(e) } finally { setLoadingoutflows(false); }
	}

	interface IFormDataValidated {
		card: number;
	}

	interface IFormData {
		card: string;
	}

	const formValidation: yup.Schema<IFormDataValidated> = yup.object().shape({
		card: yup.number().required().min(0)
	});

	const cardSubmit = async (data: IFormData) => {
		setCardLoading(true);
		try {
			if (fincash) {
				const swal = await Swal.fire({
					title: 'Tem Certeza?',
					text: `Registrar Cartão no Valor de "R$ ${data.card}" ?`,
					icon: 'question',
					iconColor: '#512DA8',
					showCancelButton: true,
					confirmButtonColor: '#512DA8',
					cancelButtonColor: '#aaa',
					cancelButtonText: 'Voltar',
					confirmButtonText: 'Confirmar'
				});
				if (swal.isConfirmed) {
					data.card = data.card.split(' ')[1];
					const dataValidated = await formValidation.validate(data, { abortEarly: false });

					const result = await FincashService.registerCardValue(dataValidated.card, fincash.id);
					if (result instanceof Error) {
						return Swal.fire({
							icon: "error",
							title: "Atenção",
							text: "Algum erro ocorreu ao tentar inserir o valor",
							showConfirmButton: true,
						});
					}

					Swal.fire({
						icon: "success",
						title: "Sucesso!",
						text: "Cartão registrado com sucesso!",
						showConfirmButton: true,
					});
					setReload(1);
				}

			}
		} catch (e) {
			console.log(e);
		} finally {
			setCardLoading(false);
		}
	}

	return (
		<LayoutMain
			title={fincash ? `Caixa: ${format(fincash.created_at, 'dd/MM/yyyy')}` : ''}
			subTitle={'Caixa: ' + fincash?.opener}
		>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={'/fechamentos'}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1 }}>
				<Box margin={5} display={'flex'} justifyContent={'space-between'}>
					<Box>
						<Typography variant="h4" margin={1}>
							{fincash?.created_at ? `${format(fincash.created_at, 'dd/MM/yy')}` : <Skeleton sx={{ maxWidth: 200 }} />}
						</Typography>
						<Typography variant="h5" margin={1}>
							{fincash?.created_at ? `${format(fincash.created_at, 'HH:mm')} - ${fincash.finalDate ? format(fincash.finalDate, 'HH:mm') : 'Aberto'}` : <Skeleton sx={{ maxWidth: 200 }} />}
						</Typography>
						<Typography variant="h5" margin={1}>
							{fincash?.opener ? 'Caixa: ' + fincash.opener : <Skeleton sx={{ maxWidth: 300 }} />}
						</Typography>
						{
							fincash?.isFinished &&

							<Box display={'flex'}>
								<Typography variant="h5" mx={1}>
									Vendas em Dinheiro:
								</Typography>

								<Typography variant="h5" color={
									fincash?.finalValue &&
										(outflows?.total || outflows?.total == 0) &&
										((fincash.finalValue - fincash.value) + outflows.total) < 0 ? '#e00' : '#00e000'
								}
								>
									{
										fincash?.finalValue ?
											(outflows?.total || outflows?.total == 0) &&
												((fincash.finalValue - fincash.value) + outflows.total) < 0 ?
												'Erro'
												:
												fincash?.finalValue &&
												(outflows?.total || outflows?.total == 0) &&
												'R$ +' + ((fincash.finalValue - fincash.value) + outflows.total).toFixed(2)
											:
											'0.00'
									}
								</Typography>
							</Box>
						}
						<Typography variant="h5" fontWeight={'bold'} margin={1} mt={5}>
							Total: R$ {fincash?.totalValue ? fincash.totalValue : '0.00'}
						</Typography>
						<Box display={'flex'} flexDirection={'column'}>
							<Link to={`/vendas/caixa/${id}`}>
								<Button
									variant="contained"
									size={'large'}
									sx={{ mt: 5 }}

								>
									<HistoryIcon sx={{ mr: 1 }} />
									Histórico de Vendas
								</Button>
							</Link>

							<Link to={`/caixa/dados/${id}`}>
								<Button
									variant="contained"
									size={'large'}
									sx={{ mt: 2 }}

								>
									<FindInPageIcon sx={{ mr: 1 }} />
									Análise de dados
								</Button>
							</Link>
						</Box>
					</Box>
					<Box>
						<Box border={1} minHeight={210} minWidth={300} my={2} sx={{ backgroundColor: '#eee' }} display={'flex'} alignItems={'center'} flexDirection={'column'} px={1}>
							<Typography variant="h5" margin={1}>
								Dinheiro
							</Typography>
							<Box minWidth={400}>
								<Box display={'flex'}>
									<Typography variant="h5" margin={1}>
										Início: R$ {fincash?.value}
									</Typography>
									<Typography variant='body2' fontSize={18} color={fincash?.diferenceLastFincash && fincash?.diferenceLastFincash < 0 ? '#ef0000' : '#00e000'}>
										{fincash?.diferenceLastFincash && fincash?.diferenceLastFincash > 0 && '+'}{fincash?.diferenceLastFincash && fincash?.diferenceLastFincash}
									</Typography>
								</Box>
								<Box display={'flex'}>
									{
										fincash?.isFinished &&
										<>
											<Typography variant="h5" mx={1}>
												Variação:
											</Typography>
											<Typography variant="h5" color={fincash?.finalValue && (fincash.finalValue - fincash.value) < 0 ? '#ef0000' : '#00e000'}>
												R$ {fincash?.finalValue && (fincash.finalValue - fincash.value) > 0 && '+'}{fincash?.finalValue ? (fincash.finalValue - fincash.value).toFixed(2) : ''}
											</Typography>
										</>
									}
								</Box>
								{
									fincash?.isFinished &&
									<>
										<Typography variant="h5" margin={1}>
											Fim: R$ {fincash?.finalValue}
										</Typography>
										{

											fincash?.finalValue &&
												(outflows?.total || outflows?.total == 0) &&
												((fincash.finalValue - fincash.value) + outflows.total) < 0 ?
												<Box
													m={2}
													ml={1}
													p={1}
													border={1}
													sx={{ backgroundColor: '#e00000' }}
												>
													<Typography variant="h5" color={'#fff'}>
														Mínimo de saídas não registradas: R$ {((fincash.finalValue - fincash.value) + outflows.total).toFixed(2)}
													</Typography>
												</Box>
												:
												<></>
										}
										{

											(fincash?.finalValue || fincash?.finalValue == 0) &&
												(fincash?.totalValue || fincash?.totalValue == 0) &&
												(outflows?.total || outflows?.total == 0) &&
												((fincash.finalValue - fincash.value) + outflows.total) - fincash.totalValue > 0 ?
												<Box
													m={2}
													ml={1}
													p={1}
													border={1}
													sx={{ backgroundColor: '#e0a000' }}
												>
													<Typography variant="h5" color={'#fff'}>
														Mínimo de vendas não registradas: R$ {(((fincash.finalValue - fincash.value) + outflows.total) - fincash.totalValue).toFixed(2)}
													</Typography>
												</Box>
												:
												<></>
										}
									</>
								}
							</Box>
						</Box>
						<Box border={1} minHeight={210} minWidth={300} my={2} sx={{ backgroundColor: '#eee' }} display={'flex'} alignItems={'center'} flexDirection={'column'}>
							<Typography variant="h5" margin={1}>
								Cartão
							</Typography>
							{
								fincash?.isFinished ?
									<>
										{
											!fincash?.cardValue ?
												<>
													<Box display={'flex'} gap={1} mt={1}>
														<VForm placeholder={''} onSubmit={cardSubmit} ref={formRef}>
															<VTextField
																name={'card'}
																label={'Valor'}
																autoComplete="off"
																valueDefault='R$ 0.00'
																cash
															/>
														</VForm>
														<Button variant="contained" onClick={() => formRef.current?.submitForm()} disabled={cardLoading}>
															<AddIcon />
														</Button>
													</Box>
													<Typography variant="h5" mt={4} color={'#e93000'}>
														Insira o valor do cartão
													</Typography>
												</>
												:
												<Box>
													<Typography variant="h5" m={1}>
														Cartão: R$ {fincash.cardValue}
													</Typography>
													<Box display={'flex'}>
														<Typography variant="h5" mx={1}>
															Quebra:
														</Typography>
														<Typography variant="h5" color={fincash.break && fincash.break < 0 ? '#ef0000' : '#00e000'}>
															R$ {fincash.break && fincash.break < 0 ? '' : '+'}{fincash.break}
														</Typography>
													</Box>
													{

														(fincash?.cardValue || fincash?.cardValue == 0) &&
														(fincash?.totalValue || fincash?.totalValue == 0) &&
														(fincash.totalValue - fincash.cardValue) < 0 &&
														<Box
															m={2}
															ml={1}
															p={1}
															border={1}
															sx={{ backgroundColor: '#e0a000' }}
														>
															<Typography variant="h5" color={'#fff'}>
																Mínimo de vendas não registradas: R$ {(fincash.totalValue - fincash.cardValue).toFixed(2)}
															</Typography>
														</Box>
													}
												</Box>
										}
									</>
									:
									<Typography variant="h5" mt={4} color={'#e90000'}>
										Disponível após fechamento do caixa.
									</Typography>
							}
						</Box>
					</Box>
					<Box border={1} minHeight={400} minWidth={500} my={2} sx={{ backgroundColor: '#eee' }} display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexDirection={'column'} py={2}>
						<Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
							<Typography variant="h5" margin={1}>
								Saídas
							</Typography>

							<Box minWidth={400} minHeight={200}>
								<Table>
									<TableBody>
										{outflows?.outflows.map((outflow) =>
											<TableRow key={outflow.id}>
												<TableCell>
													<Typography variant="h5">
														{outflow.type}
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h5">
														R$ {outflow.value}
													</Typography>
												</TableCell>
												<TableCell>
													<Link to={`/saidas/${outflow.id}?caixa=${fincash?.id}`}>
														<Fab
															size="small"
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
										)}
									</TableBody>
								</Table>
							</Box>
							{outflowTotalCount > 0 && (
								<Pagination
									sx={{ m: 2 }}
									disabled={loadingOutflows}
									page={Number(outflowPage)}
									count={Math.ceil(outflowTotalCount / OUTFLOW_ROW_LIMIT)}
									onChange={(_, newPage) => setSearchParams({ outflowPage: newPage.toString() }, { replace: true })}
									siblingCount={0}
								/>
							)}
						</Box>

						<Box mb={5}>
							<Typography variant="h5">
								Total: R$ {outflows?.total.toFixed(2)}
							</Typography>
						</Box>
					</Box>
				</Box>
				<Box display={'flex'} flexDirection={'column'} gap={2} margin={2}>
					<TextField
						rows={4}
						fullWidth
						multiline
						sx={{ mt: 2 }}
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						label="Descrição"
						id="elevation-multiline-static"
						autoComplete="off"
						disabled={loading}

					/>
					<Button variant="contained" color="primary" size="large" sx={{ maxWidth: 250 }} disabled={loading || fincash?.obs == desc}>
						Alterar Descrição
					</Button>
				</Box>
			</Paper>
		</LayoutMain >
	);
};