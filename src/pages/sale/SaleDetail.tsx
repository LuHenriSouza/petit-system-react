import {
	Box,
	Table,
	Paper,
	Button,
	Skeleton,
	useTheme,
	TableRow,
	TextField,
	TableHead,
	TableCell,
	TableBody,
	Typography,
	Pagination,
	useMediaQuery,
	TableContainer,
	CircularProgress
} from "@mui/material";
import Swal from 'sweetalert2'
import { format } from 'date-fns';
import './../../shared/css/sweetAlert.css'
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { Environment } from "../../shared/environment";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import { FincashService, IFincash, IProduct, ISaleDetail, ISaleRaw, ProductService, SaleService } from "../../shared/services/api";


export const SaleDetail: React.FC = () => {
	const { id } = useParams();
	const [obs, setObs] = useState('');
	const [NAObs, setNAObs] = useState(false);
	const [lastOBS, setLastOBS] = useState('');
	const [sale, setSale] = useState<ISaleRaw>();
	const [loading, setLoading] = useState(false);
	const [fincash, setFincash] = useState<IFincash>();
	const [pageLoading, setPageLoading] = useState(false);
	const [totalCountPage, setTotalCountPage] = useState(0);
	const [searchParams, setSearchParams] = useSearchParams();
	const [totalProductsPrice, setTotalProductsPrice] = useState(0);
	const [saleDetail, setSaleDetail] = useState<ISaleDetail[]>([]);
	const [productDetails, setProductDetails] = useState<Omit<IProduct, 'code' | 'sector' | 'created_at' | 'updated_at'>[]>([]);

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);


	useEffect(() => {
		const fetchData = async () => {
			try {

				const saleFetch = await SaleService.getById(Number(id));
				if (saleFetch instanceof Error) return 'sale not found';
				setSale(saleFetch);

				if (saleFetch.obs) { setObs(saleFetch.obs); setNAObs(true); setLastOBS(saleFetch.obs) }

				const fincashFetch = await FincashService.getById(Number(saleFetch.fincash_id));
				if (fincashFetch instanceof Error) return 'fincash not found';
				setFincash(fincashFetch);
			} catch (e) {

				console.log(e);
			}
		}

		fetchData();
	}, []);

	const listProducts = async () => {
		setPageLoading(true);
		try {
			const SaleDetailFetch = await SaleService.getAllById(Number(id), Number(page));
			if (SaleDetailFetch instanceof Error) return 'Products not found';
			setSaleDetail(SaleDetailFetch.data);
			setTotalCountPage(SaleDetailFetch.totalCount);
			setTotalProductsPrice(SaleDetailFetch.totalValue);

			const productIds = SaleDetailFetch.data.map((saleDetail) => saleDetail.prod_id);
			const productDetailsArray: Omit<IProduct, 'code' | 'sector' | 'created_at' | 'updated_at'>[] = [];

			for (const productId of productIds) {
				const product = await ProductService.getById(productId);
				if (product instanceof Error) {
					console.error(`Product not found for product id: ${productId}`);
				} else {
					productDetailsArray.push({ id: productId, name: product.name, price: product.price, deleted_at: product.deleted_at });
				}
			}
			setProductDetails(productDetailsArray);
		}
		catch (e) {
			console.error(e);
		} finally {
			setPageLoading(false);
		}
	}

	useEffect(() => {
		setProductDetails([]);
		listProducts();
	}, [page])

	const handleClickAdd = async () => {
		setLoading(true);
		try {

			const result = await SaleService.createObs(Number(id), { obs: obs.trim() });

			if (result instanceof Error) {
				return Swal.fire({
					icon: "error",
					title: "Atenção",
					text: "Observação não pode ser vazia",
					showConfirmButton: true,
				});
			}

			Swal.fire({
				icon: "success",
				title: "Sucesso!",
				text: "Observação adicionada com sucesso!",
				showConfirmButton: true,
			});
			setNAObs(true);
			setLastOBS(obs.trim());
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<LayoutMain title={"Venda " + id} subTitle={"Venda " + id}>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={'/vendas'}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
				<Box minHeight={550} margin={5}>
					<Typography variant="h4" margin={1}>{sale?.created_at ? format(sale.created_at, 'dd/MM/yyyy - HH:mm:ss') : <Skeleton sx={{ maxWidth: 400 }} />}</Typography>
					<Typography variant="h5" margin={1}>{fincash?.opener ? 'Caixa: ' + fincash.opener : <Skeleton sx={{ maxWidth: 100 }} />}</Typography>
					<Typography variant="h6" margin={1}>Produtos:</Typography>
					<TableContainer sx={{ minHeight: 428 }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Produto</TableCell>
									<TableCell>Preço Atual</TableCell>
									<TableCell>Preço Vendido</TableCell>
									<TableCell>Quantidade</TableCell>
									<TableCell>Preço Total</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{saleDetail.length > 0 ? saleDetail.map((saleDetail, index) =>
								(
									<TableRow key={saleDetail.prod_id}>
										<TableCell>{productDetails[index]?.name || <Skeleton />}{productDetails[index]?.deleted_at && ' (APAGADO: ' + format(productDetails[index].deleted_at as Date, 'dd/MM/yy') + ")"}</TableCell>
										<TableCell>{productDetails[index]?.price || <Skeleton sx={{ maxWidth: 50 }} />}</TableCell>
										<TableCell>{saleDetail.price}</TableCell>
										<TableCell>{saleDetail.quantity}</TableCell>
										<TableCell>{saleDetail.pricetotal}</TableCell>
									</TableRow >
								)
								)
									:
									<>
										<TableRow>
											<TableCell colSpan={5}> <Skeleton /></TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={5}> <Skeleton /></TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={5}> <Skeleton /></TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={5}> <Skeleton /></TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={5}> <Skeleton /></TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={5}> <Skeleton /></TableCell>
										</TableRow>
									</>
								}
							</TableBody>
						</Table>
					</TableContainer>
					<Box display={'flex'} justifyContent={'space-between'} mt={2}>
						<Box display={'flex'}>
							{/* PAGINATION */}
							{(totalCountPage > 0 && totalCountPage > Environment.LIMITE_DE_LINHAS) && (
								<Pagination
									disabled={pageLoading}
									page={Number(page)}
									count={Math.ceil(totalCountPage / Environment.LIMITE_DE_LINHAS)}
									onChange={(_, newPage) => setSearchParams({ page: newPage.toString() }, { replace: true })}
									siblingCount={smDown ? 0 : 1}
								/>
							)}
							{pageLoading && <CircularProgress />}
						</Box>

						{(totalCountPage <= 0 || totalCountPage <= Environment.LIMITE_DE_LINHAS) && (
							<Box></Box>
						)}


						<Typography variant="h6" sx={{ mt: 3, mr: 20 }}>Total: R$ {totalProductsPrice}</Typography>
					</Box>
					<Box >
						<TextField
							rows={4}
							fullWidth
							multiline
							sx={{ mt: 2 }}
							value={obs}
							onChange={(e) => setObs(e.target.value)}
							label="Observações"
							id="elevation-multiline-static"
							autoComplete="off"
							disabled={loading}
						/>
						<Button variant="contained" color="primary" style={{ marginTop: '16px' }} size="large" onClick={handleClickAdd} disabled={loading || !obs || obs == lastOBS}>
							{NAObs ? 'Editar Observação' : 'Adicionar Observação'}
						</Button>
						{loading && <CircularProgress />}
					</Box>

				</Box >
			</Paper >
		</LayoutMain >
	);
};