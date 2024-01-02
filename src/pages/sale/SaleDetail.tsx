import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FincashService, IFincash, IProduct, ISaleDetail, ISaleRaw, ProductService, SaleService } from "../../shared/services/api";
import { LayoutMain } from "../../shared/layouts";
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";

import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import { format } from 'date-fns';

export const SaleDetail: React.FC = () => {
	const { id } = useParams();
	const [sale, setSale] = useState<ISaleRaw>();
	const [fincash, setFincash] = useState<IFincash>();
	const [saleDetail, setSaleDetail] = useState<ISaleDetail[]>([]);
	const [productDetails, setProductDetails] = useState<Omit<IProduct, 'code' | 'sector' | 'created_at' | 'updated_at'>[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {

				const saleFetch = await SaleService.getById(Number(id));
				if (saleFetch instanceof Error) return 'sale not found';
				setSale(saleFetch);


				const fincashFetch = await FincashService.getById(Number(saleFetch.fincash_id));
				if (fincashFetch instanceof Error) return 'fincash not found';
				setFincash(fincashFetch);


				const SaleDetailFetch = await SaleService.getAllById(Number(id));
				if (SaleDetailFetch instanceof Error) return 'Products not found';
				setSaleDetail(SaleDetailFetch);

				const productIds = SaleDetailFetch.map((saleDetail) => saleDetail.prod_id);
				const productDetailsArray: Omit<IProduct, 'code' | 'sector' | 'created_at' | 'updated_at'>[] = [];

				for (const productId of productIds) {
					const product = await ProductService.getById(productId);
					if (product instanceof Error) {
						console.error(`Product not found for product id: ${productId}`);
					} else {
						productDetailsArray.push({ id: productId, name: product.name, price: product.price });
					}
				}
				setProductDetails(productDetailsArray)

				console.log('productDetails: ')
				console.log(productDetails)


			} catch (e) {

				console.log(e);
			}
		}

		fetchData();
	}, []);
	return (
		<LayoutMain title={"Venda " + id} subTitle={"Venda " + id}>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={'/vendas'}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
				<Box minHeight={550} margin={5}>
					<Typography variant="h4" margin={1}>Caixa: {fincash?.opener}</Typography>
					<Typography variant="h5" margin={1}>Data: {sale?.created_at ? format(sale.created_at, 'dd/MM/yyyy - HH:mm:ss') : 'Data não disponível'}</Typography>
					<Typography variant="h6" margin={1}>Produtos:</Typography>
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
							{saleDetail.map((saleDetail, index) =>
							(
								<TableRow key={saleDetail.prod_id}>
									<TableCell>{productDetails[index]?.name}</TableCell>
									<TableCell>{productDetails[index]?.price}</TableCell>
									<TableCell>{saleDetail.price}</TableCell>
									<TableCell>{saleDetail.quantity}</TableCell>
									<TableCell>{saleDetail.pricetotal}</TableCell>
								</TableRow >
							)
							)}
						</TableBody>
					</Table>
					<Box style={{ position: 'sticky', bottom: '16px', padding: '16px', background: '#fff' }}>
						<TextField
							id="outlined-multiline-static"
							label="Observações"
							rows={4}
							multiline
							fullWidth
							sx={{ mt: 2 }}
						/>
						<Button variant="contained" color="primary" style={{ marginTop: '16px' }} size="large">
							Adicionar Observação
						</Button>
					</Box>

				</Box >
			</Paper >
		</LayoutMain >
	);
};