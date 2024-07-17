import {
	Box,
	Fab,
	Paper,
	Table,
	useTheme,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	Pagination,
	Typography,
	useMediaQuery,
	TableContainer,
	Skeleton,
} from "@mui/material";
import { format } from 'date-fns';
import { LayoutMain } from "../../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { Environment } from "../../../shared/environment";
import {
	Link,
	// useNavigate,
	useSearchParams
} from "react-router-dom";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { FincashService, IFincash } from "../../../shared/services/api";
import { useDebounce } from '../../../shared/hooks';

const NUMBER_OF_SKELETONS = Array(7).fill(null);

export const AllFincashs: React.FC = () => {
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	// const navigate = useNavigate();

	const { debounce } = useDebounce();


	const [searchParams, setSearchParams] = useSearchParams();

	const [rows, setRows] = useState<IFincash[]>([]);
	const [openFincashValue, setOpenFincashValue] = useState<number>();
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);

	// const search = useMemo(() => {
	// 	return searchParams.get('search') || ''
	// }, [searchParams])

	useEffect(() => {
		debounce(() => {
			listFincashs();
			displayOpenedFincashValue();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// search,
		page
	]);

	const displayOpenedFincashValue = async () => {
		const fincash = await FincashService.getOpenFincash();
		if (!(fincash instanceof Error)) {
			const data = await FincashService.getTotalByFincash(fincash.id);
			if (!(data instanceof Error)) {
				setOpenFincashValue(data);
			}
		}
	}

	const listFincashs = async () => {
		setLoading(true);
		try {
			const result = await FincashService.getAll(Number(page), '', NUMBER_OF_SKELETONS.length);

			if (result instanceof Error) {
				alert(result.message);
			} else {
				const fincashs = result.data;

				setTotalCount(result.totalCount);
				setRows(fincashs);
				// const objarr = fincashs.map(item => ({ id: item.id, init: item.value, final: item.finalValue }));

				// const record: Record<number, number> = {};
				// for (let index = 0; index < objarr.length - 1; index++) {
				// 	const item = objarr[index];
				// 	const nextItem = objarr[index + 1];
				// 	if (nextItem.final || nextItem.final === 0.00) {
				// 		const result = item.init - nextItem.final;
				// 		if (result !== 0) record[item.id] = result;
				// 	}
				// }

				// console.log(record);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};


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
														<Typography>
															R$ {row.totalValue ? row.totalValue : openFincashValue == 0 ? '0.00' : openFincashValue ?? (row.totalValue == 0 || row.totalValue == null) ? '0.00' : <Skeleton sx={{ minHeight: 30, maxWidth: 30 }} />}
														</Typography>
													</TableCell>

													<TableCell>
														<Link to={'/caixa/' + row.id}>
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
					{(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
						<TableRow>
							<TableCell colSpan={3}>
								<Pagination
									page={Number(page)}
									count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
									onChange={(_, newPage) => setSearchParams({ page: newPage.toString() }, { replace: true })}
									siblingCount={smDown ? 0 : 1}
								/>
							</TableCell>
						</TableRow>
					)}
				</Paper>
			</LayoutMain >
		</>
	);
};