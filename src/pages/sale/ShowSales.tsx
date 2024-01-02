import { Box, Fab, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IGetSales, SaleService } from "../../shared/services/api";
import { Environment } from "../../shared/environment";
import { format } from 'date-fns';

export const ShowSales: React.FC = () => {
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const [searchParams, setSearchParams] = useSearchParams();
	const [rows, setRows] = useState<IGetSales[]>([]);
	const [totalCount, setTotalCount] = useState(0);

	const search = useMemo(() => {
		return searchParams.get('search') || ''
	}, [searchParams])

	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);


	const listSales = () => {

		SaleService.getSales(Number(page), search)
			.then((result) => {
				if (result instanceof Error) {
					alert(result.message);
				} else {
					console.log(result);

					setTotalCount(result.totalCount);
					setRows(result.data);
				}
			});
	}

	useEffect(() => {
		listSales();
	}, [search, page]);

	return (
		<>
			<LayoutMain title="Vendas" subTitle={"Gerencie as vendas do dia"}>
				<Paper variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
					<Box minHeight={550}>
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
									{rows.map((row, index) => (
										<TableRow key={index}>
											<TableCell>{row.sale_id}</TableCell>
											<TableCell>{format(row.created_at, 'HH:mm:ss')}</TableCell>
											<TableCell>R$ {row.totalValue}</TableCell>
											<TableCell>
												<Link to={'/vendas/' + row.sale_id}>
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
									))}
								</TableBody>

								{totalCount === 0 && (
									<caption>Nenhuma venda efetuada</caption>
								)}
								<TableFooter>
									{(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
										<TableRow>
											<TableCell colSpan={3}>
												<Pagination
													page={Number(page)}
													count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
													onChange={(_, newPage) => setSearchParams({ search, page: newPage.toString() }, { replace: true })}
													siblingCount={smDown ? 0 : 1}
												/>
											</TableCell>
										</TableRow>
									)}
								</TableFooter>
							</Table>
						</TableContainer>


					</Box>
				</Paper>
			</LayoutMain >
		</>
	);
};