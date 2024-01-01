import { Paper, Grid, Box, TextField, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Alert, useMediaQuery, useTheme, Typography, Button } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useRef, useState } from "react";
import { FincashService, IFincash, SaleService, ISale } from "../../shared/services/api";
import { useNavigate } from "react-router-dom";
import { IProduct, ProductService } from './../../shared/services/api/Products/ProductService';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import Swal from 'sweetalert2'

export const Sale: React.FC = () => {
	const [openFincash, setOpenFincash] = useState<Error | IFincash>(Error('default'));
	const [products, setProducts] = useState<IProduct[]>([]);
	const [code, setCode] = useState('');
	const [totalPrice, setTotalPrice] = useState(0);
	const [notFound, setNotFound] = useState(false);
	const codeInputRef = useRef<HTMLInputElement>();
	const navigate = useNavigate();
	const theme = useTheme()
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {

		const fetchData = async () => {
			const result = await FincashService.getOpenFincash();
			setOpenFincash(result);
		}
		if (!smDown) {
			fetchData();
		} else {
			alert('Essa tela não funciona em smartphones')
			navigate('/');
		}
	}, []);


	if (openFincash instanceof Error) {
		navigate('/caixa/novo');
	}

	useEffect(() => {
		const totalCalc = products.map((prod) => {
			const calc = (prod.quantity || 0) * prod.price;
			return calc;
		})


		setTotalPrice(totalCalc.reduce((total, currentItem) => total + currentItem, 0))

	}, [products]);


	const handleQuantityChange = (productCode: string, changeAmount: number) => {
		setProducts((prevProducts) => {
			const updatedProducts = prevProducts.map((product) => {
				if (product.code === productCode) {
					const newQuantity = (product.quantity || 0) + changeAmount;

					return newQuantity > 0 ? { ...product, quantity: newQuantity } : null;
				}

				return product;
			});

			const filteredProducts = updatedProducts.filter(Boolean) as IProduct[];

			return filteredProducts;
		});
	};


	const handleEnter = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		setNotFound(false);
		if (e.code === 'Enter' || e.key === 'Enter') {
			if (!code.trim()) return;

			const result = await ProductService.getByCode(code);
			if (result instanceof Error) {
				setNotFound(true);
			} else {
				// Check if the product is already in the products array
				const existingProductIndex = products.findIndex((p) => p.code === result.code);

				if (existingProductIndex !== -1) {
					// If the product exists, update its quantity
					const updatedProducts = [...products];
					updatedProducts[existingProductIndex] = {
						...result,
						quantity: (updatedProducts[existingProductIndex].quantity || 0) + 1,
					};
					setProducts(updatedProducts);
				} else {
					// If the product doesn't exist, add it to the products array
					setProducts((prevProducts) => [...prevProducts, { ...result, quantity: 1 }]);
				}
			}

			setCode('');
		}
	};

	const handleSubmit = async () => {
		try {
			// const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
			//     prod_id: yup.number().moreThan(0).required().integer(),
			//     quantity: yup.number().moreThan(0).required().integer(),
			//     price: yup.number().required(),
			// });
			const data = products.map((prod) => {
				return {
					prod_id: prod.id,
					price: prod.price,
					quantity: prod.quantity
				}
			});

			const result = await SaleService.create(data as Omit<ISale, "id">[]);
			if (result instanceof Error) return alert('Venda não efetuada.');
			setProducts([])
			Swal.fire({
				icon: "success",
				title: "Venda efetuada com sucesso!",
				showConfirmButton: false,
				timer: 1000,
			});
		} catch (error) {
			return alert(error);
		}
	}


	return (

		<LayoutMain title="Vender" subTitle="">
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Paper component={Paper} variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						<Box display={'flex'}>
							<TextField
								fullWidth
								size="small"
								placeholder={'Código'}
								inputRef={codeInputRef}
								onKeyDown={handleEnter}
								value={code} onChange={(e) => setCode(e.target.value)}
							/>
						</Box>
					</Paper>
					<Paper component={Paper} variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						{(notFound && <Alert severity="error">Nenhum produto encontrado com este código !</Alert>)}
						<Box display={'flex'} minHeight={550}>
							<TableContainer>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell width={100}>Código</TableCell>
											<TableCell>Nome</TableCell>
											<TableCell>Preço</TableCell>
											<TableCell>Quantidade</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{products.map((row) => (
											<TableRow
												key={row.code}
												hover
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell>{row.code}</TableCell>
												<TableCell>{row.name}</TableCell>
												<TableCell>{row.price}</TableCell>
												<TableCell>
													<Box display={'flex'} gap={1}>
														<ArrowLeftRoundedIcon
															sx={{ cursor: 'pointer' }}
															onClick={() => handleQuantityChange(row.code, -1)}
														/>
														<Box marginTop={'3px'}>
															{row.quantity}
														</Box>
														<ArrowRightRoundedIcon
															sx={{ cursor: 'pointer' }}
															onClick={() => handleQuantityChange(row.code, 1)}
														/>
													</Box>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
						<Box display={'flex'} gap={38}>
							<Button
								variant="contained"
								sx={{ mb: 2, ml: 3 }}
								disabled={products && products.length === 0}
								onClick={handleSubmit}
							>
								<AddShoppingCartRoundedIcon sx={{ mr: 1 }} /> Finalizar
							</Button>
							<Typography variant="h6">Total: R$ {totalPrice}</Typography>
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper component={Paper} variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						TABLE
					</Paper>
				</Grid>
			</Grid>
		</LayoutMain >
	);
};