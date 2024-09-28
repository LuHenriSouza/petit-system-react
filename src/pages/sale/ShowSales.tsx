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
	Button,
} from "@mui/material";
import Swal from "sweetalert2";
import { format } from 'date-fns';
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { Environment } from "../../shared/environment";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FincashService, IFincash, IGetSales, SaleService } from "../../shared/services/api";
import { nToBRL } from "../../shared/services/formatters";

const NUMBER_OF_SKELETONS = Array(7).fill(null);

export const ShowSales: React.FC = () => {
	const { id } = useParams();
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	const navigate = useNavigate();


	const [searchParams, setSearchParams] = useSearchParams();
	const [rows, setRows] = useState<IGetSales[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [fincash, setFincash] = useState<IFincash>();

	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);

	const backPage = useMemo(() => {
		return searchParams.get('backPage') || 1;
	}, [searchParams]);


	const listSales = async (fincashId: number) => {
		try {
			const result = await SaleService.getSalesByFincash(fincashId, Number(page));
			if (result instanceof Error) {
				alert(result.message);
			} else {
				console.log(result);

				setTotalCount(result.totalCount);
				setRows(result.data);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (id) {
			fetchDataId(Number(id));
		} else {
			fetchData();
		}
	}, [page]);

	const fetchDataId = async (id: number) => {
		setLoading(true);
		listSales(id);

	}

	const fetchData = async () => {
		setLoading(true);
		if (!fincash) {
			const fincashData = await FincashService.getOpenFincash();
			if (fincashData instanceof Error) {
				Swal.fire({
					icon: "error",
					title: "Erro",
					text: "Nenhum caixa aberto encontrado!",
					showConfirmButton: true,
				});
				navigate('/caixa/novo');
			} else {
				setFincash(fincashData);
				listSales(fincashData.id);
			}
		} else {
			listSales(fincash.id);
		}

	}

	return (
		<>
			<LayoutMain title="Vendas" subTitle={"Gerencie as vendas do caixa"}>
				{
					id &&
					<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
						<Box display={'flex'} justifyContent={'space-between'}>
							<Link to={`/caixa/${id}?backPage=${backPage}`}>
								<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
							</Link>
						</Box>
					</Paper>
				}
				<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
					<Box minHeight={625}>
						<TableContainer>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Venda</TableCell>
										<TableCell>Horário</TableCell>
										<TableCell>Valor</TableCell>
										<TableCell>Ações</TableCell>
										<TableCell>Observações</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{!loading ?
										rows?.map(
											(row) => (
												<TableRow key={row.sale_id}>
													<TableCell>{row.sale_id}</TableCell>
													<TableCell>{format(row.created_at, 'HH:mm:ss')}</TableCell>
													<TableCell>{nToBRL(row.total_value)}</TableCell>
													<TableCell>
														<Link to={id ? `/vendas/${row.sale_id}?back=${id}` : '/vendas/' + row.sale_id}>
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
									onChange={(_, newPage) =>
										setSearchParams((old) => {
											old.set("page", newPage.toString());
											return old;
										})
									}
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