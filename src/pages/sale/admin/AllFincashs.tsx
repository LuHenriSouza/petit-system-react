import {
	Box,
	Fab,
	Paper,
	Table,
	Skeleton,
	useTheme,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	Pagination,
	Typography,
	useMediaQuery,
	TableContainer,
} from "@mui/material";
import { format } from 'date-fns';
import { useDebounce } from '../../../shared/hooks';
import { LayoutMain } from "../../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Environment } from "../../../shared/environment";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { FincashService, IFincash, OutflowService } from "../../../shared/services/api";

const NUMBER_OF_SKELETONS = Array(7).fill(null);

export const AllFincashs: React.FC = () => {
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	// const navigate = useNavigate();

	const { debounce } = useDebounce();

	enum EFincashErrors {
		CardSaleError,
		CashSaleError,
		CashOutError,
		// CardSaleError = 'CardSaleError',
		// CashSaleError = 'CashSaleError',
		// CashOutError = 'CashOutError',
	}

	enum EErrorsColor {
		MediumError = '#fff000',
		HighError = '#fe4000',

		CardlessError = '#4f00a0',
	}

	const [searchParams, setSearchParams] = useSearchParams();

	const [rows, setRows] = useState<IFincash[]>([]);
	const [fincashOpen, setFincashOpen] = useState<IFincash>();
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [errorLoading, setErrorLoading] = useState(true);
	const [erros, setErros] = useState<Record<string, EFincashErrors[]>>();

	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);

	// const search = useMemo(() => {
	// 	return searchParams.get('search') || ''
	// }, [searchParams])

	useEffect(() => {
		debounce(() => {
			listFincashs();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	useEffect(() => {
		FincashErrorCalculator(rows, fincashOpen);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rows, fincashOpen]);

	const listFincashs = async () => {
		setLoading(true);
		try {
			const result = await FincashService.getAll(Number(page), '', NUMBER_OF_SKELETONS.length);
			if (result instanceof Error) return alert(result.message);

			const fincashs = result.data;
			const fincashOpen = await FincashService.getOpenFincash();

			if (!(fincashOpen instanceof Error)) {
				const total = await FincashService.getTotalByFincash(fincashOpen.id);
				if (!(total instanceof Error)) {
					if (fincashs[0].id == fincashOpen.id) fincashs[0].totalValue = total;
				}
				setFincashOpen(fincashOpen);
			}
			setRows(fincashs);
			setTotalCount(result.totalCount);

		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};


	const FincashErrorCalculator = async (fincashs: IFincash[], fincashOpen?: IFincash | Error) => {
		setErrorLoading(true);
		const erros: Record<string, EFincashErrors[]> = {}
		for (const fincash of fincashs) { //FINCASH ITERATOR
			const outflowTotal = await OutflowService.getTotalByFincash(fincash.id);
			if ((outflowTotal instanceof Error)) { console.log(fincash.id); continue; }

			if (!(fincashOpen instanceof Error)) if (Number(fincash.id) == Number(fincashOpen?.id)) continue;

			if (!erros[fincash.id]) {
				erros[fincash.id] = [];
			}

			if (fincash.finalValue == null) fincash.finalValue = 0;
			if (fincash.totalValue == null) fincash.totalValue = 0;

			if ((fincash.finalValue || fincash.finalValue == 0) && (fincash.totalValue || fincash.totalValue == 0)) {
				if (((fincash.finalValue - fincash.value) + Number(outflowTotal)) < 0) erros[fincash.id].push(EFincashErrors.CashOutError);
				if (fincash.cardValue) {
					if ((fincash.totalValue - fincash.cardValue) < 0) erros[fincash.id].push(EFincashErrors.CardSaleError);
				}
				if (((fincash.finalValue - fincash.value) + Number(outflowTotal)) > fincash.totalValue) erros[fincash.id].push(EFincashErrors.CashSaleError);
			}
		}
		setErros(erros);
		setErrorLoading(false);
	}

	return (
		<>
			<LayoutMain title="Fechamentos" subTitle={"Gerencie os fechamentos de caixa"}>
				<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
					<Box minHeight={625}>
						<TableContainer>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Dia</TableCell>
										<TableCell>Nome</TableCell>
										<TableCell>Horário</TableCell>
										<TableCell colSpan={2}>Dinheiro do Caixa</TableCell>
										<TableCell>Final</TableCell>
										<TableCell>Total de Vendas</TableCell>
										<TableCell>Ações</TableCell>
										<TableCell>Observações</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{!loading ?
										rows?.map(
											(row) => (
												<TableRow key={row.id}>
													<TableCell>
														<Typography>
															{`${format(row.created_at, 'dd/MM/yy')}`}
														</Typography>
													</TableCell>
													<TableCell sx={{ maxWidth: 40 }}>
														<Typography noWrap overflow="hidden" textOverflow="ellipsis">
															{row.opener}
														</Typography>
													</TableCell>
													<TableCell>
														<Typography>
															{`${format(row.created_at, 'HH:mm')} - ${row.finalDate ? format(row.finalDate, 'HH:mm') : 'Aberto'}`}
														</Typography>
													</TableCell>
													<TableCell sx={{ backgroundColor: '#eee' }}>
														<Typography variant='body2' fontSize={11.5} color={row.diferenceLastFincash && row.diferenceLastFincash < 0 ? '#ef0000' : '#00e000'}>
															{row.diferenceLastFincash && row.diferenceLastFincash > 0 && '+'}{row.diferenceLastFincash && row.diferenceLastFincash}
														</Typography>
														<Typography>
															R$ {row.value}
														</Typography>
													</TableCell>
													<TableCell sx={{ backgroundColor: '#eee' }}>
														<Typography color={row.finalValue && (row.finalValue - row.value) < 0 ? '#ef0000' : '#00e000'}>
															R$ {row.finalValue ? (row.finalValue - row.value).toFixed(2) : '........'}
														</Typography>
													</TableCell>
													<TableCell sx={{ backgroundColor: '#eee' }}>
														<Typography>
															R$ {row.finalValue ? row.finalValue : '........'}
														</Typography>
													</TableCell>

													<TableCell>
														<Box display={'flex'} gap={1}>
															<Typography>
																R$ {row.totalValue == 0 ? '0.00' : row.totalValue}
															</Typography>
															{!errorLoading ?
																(
																	erros &&
																	erros[row.id] &&
																	erros[row.id].includes(EFincashErrors.CardSaleError) &&
																	<Box height={10} width={10} borderRadius={90} border={1} sx={{ backgroundColor: EErrorsColor.MediumError }} />
																) : (
																	<Skeleton sx={{ maxHeight: 10, maxWidth: 10, borderRadius: 90 }} />
																)
															}
															{!errorLoading ?
																(
																	erros &&
																	erros[row.id] &&
																	erros[row.id].includes(EFincashErrors.CashOutError) &&
																	<Box height={10} width={10} border={1} borderRadius={90} sx={{ backgroundColor: EErrorsColor.HighError }} />
																) : (
																	<Skeleton sx={{ maxHeight: 10, maxWidth: 10, borderRadius: 90 }} />
																)
															}
															{!errorLoading ?
																(
																	erros &&
																	erros[row.id] &&
																	erros[row.id].includes(EFincashErrors.CashSaleError) &&
																	<Box height={10} width={10} border={1} borderRadius={90} sx={{ backgroundColor: EErrorsColor.MediumError }} />
																) : (
																	<Skeleton sx={{ maxHeight: 10, maxWidth: 10, borderRadius: 90 }} />
																)
															}
														</Box>
													</TableCell>

													<TableCell>
														<Box display={'flex'}>
															<Link to={'/caixa/' + row.id + '?backPage=' + page}>
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
															{
																!row.cardValue &&
																<Box height={10} width={10} borderRadius={90} sx={{ backgroundColor: EErrorsColor.CardlessError }} />
															}
														</Box>
													</TableCell>
													<TableCell sx={{ maxWidth: 120 }}>
														<Typography noWrap overflow="hidden" textOverflow="ellipsis" marginRight={6}>
															{row.obs}
														</Typography>
													</TableCell>
												</TableRow>
											)
										)
										:
										NUMBER_OF_SKELETONS.map((_, index) => (
											<TableRow key={index}>
												<TableCell >
													<Skeleton sx={{ minHeight: 40, maxWidth: 50 }} />
												</TableCell>
												<TableCell >
													<Skeleton sx={{ minHeight: 40, maxWidth: 80 }} />
												</TableCell>
												<TableCell >
													<Skeleton sx={{ minHeight: 40, maxWidth: 80 }} />
												</TableCell>
												<TableCell sx={{ backgroundColor: '#eee' }}>
													<Skeleton sx={{ minHeight: 40, maxWidth: 70 }} />
												</TableCell>
												<TableCell sx={{ backgroundColor: '#eee' }}>
													<Skeleton sx={{ minHeight: 40, maxWidth: 70 }} />
												</TableCell>
												<TableCell sx={{ backgroundColor: '#eee' }}>
													<Skeleton sx={{ minHeight: 40, maxWidth: 70 }} />
												</TableCell>
												<TableCell >
													<Skeleton sx={{ minHeight: 40, maxWidth: 60 }} />
												</TableCell>
												<TableCell >
													<Fab disabled size='medium'></Fab>
												</TableCell>
												<TableCell >
													<Skeleton sx={{ minHeight: 40, maxWidth: 230 }} />
												</TableCell>
											</TableRow>
										))
									}
								</TableBody>

								{totalCount === 0 && !loading && (
									<caption>Nenhuma venda efetuada</caption>
								)}
							</Table>
						</TableContainer>
					</Box>
					<Box display={'flex'} justifyContent={'space-between'}>
						{(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) ? (
							<Pagination
								sx={{ m: 1 }}
								page={Number(page)}
								count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
								onChange={(_, newPage) => setSearchParams({ page: newPage.toString() }, { replace: true })}
								siblingCount={smDown ? 0 : 1}
							/>
						) :
							<Box />
						}
						<Box display={'flex'} alignItems={'center'} pr={10} gap={4}>

							<Box display={'flex'} gap={1} alignItems={'center'}>
								<Box height={10} width={10} border={1} sx={{ backgroundColor: EErrorsColor.HighError }} />
								<Typography fontWeight={'bold'}>
									Erro Grave
								</Typography>
							</Box>
							<Box display={'flex'} gap={1} alignItems={'center'}>
								<Box height={10} width={10} border={1} sx={{ backgroundColor: EErrorsColor.MediumError }} />
								<Typography fontWeight={'bold'}>
									Erro
								</Typography>
							</Box>
							<Box display={'flex'} gap={1} alignItems={'center'}>
								<Box height={12} width={12} borderRadius={90} sx={{ backgroundColor: EErrorsColor.CardlessError }} />
								<Typography fontWeight={'bold'}>
									Caixa sem cartão
								</Typography>
							</Box>
						</Box>
					</Box>

				</Paper>
			</LayoutMain >
		</>
	);
};
