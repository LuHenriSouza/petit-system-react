import { Paper, Grid, Box, TextField, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Alert, useMediaQuery, useTheme, Typography, Button } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useRef, useState } from "react";
import { FincashService, IFincash, SaleService, GroupService, IGroup, ISaleObs } from "../../shared/services/api";
import { useNavigate } from "react-router-dom";
import { IProduct, ProductService } from './../../shared/services/api/';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import Swal from 'sweetalert2'
import SettingsIcon from '@mui/icons-material/Settings';
import FastRewindIcon from '@mui/icons-material/FastRewind';

export const Sale: React.FC = () => {

	const theme = useTheme()
	const navigate = useNavigate();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const [code, setCode] = useState('');
	const [obs, setObs] = useState('');
	const [totalPrice, setTotalPrice] = useState(0);
	const [notFound, setNotFound] = useState(false);
	const [products, setProducts] = useState<IProduct[]>([]);
	const [lastResult, setLastResult] = useState('');
	const [openFincash, setOpenFincash] = useState<Error | IFincash>(Error('default'));

	const [groups, setGroups] = useState<IGroup[]>();

	const codeInputRef = useRef<HTMLInputElement>();

	useEffect(() => {

		const fetchData = async () => {
			const result = await FincashService.getOpenFincash();
			setOpenFincash(result);
			listGroups();
		}
		if (!smDown) {
			fetchData();
		} else {
			alert('Essa tela não funciona em smartphones')
			navigate('/');
		}
	}, []);


	const listGroups = async () => {
		try {
			const response = await GroupService.getShowGroups();
			if (response instanceof Error) return;
			setGroups(response);
		} catch (e) {
			alert(e)
		}
	}


	if (openFincash instanceof Error) {
		navigate('/caixa/novo');
	}

	useEffect(() => {
		const totalCalc = products.map((prod) => {
			const calc = (prod.quantity || 0) * prod.price;
			const calc100 = calc * 100;
			return calc100;
		})


		setTotalPrice(totalCalc.reduce((total, currentItem) => total + currentItem, 0) / 100);

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
			if (!code.trim() && !lastResult.trim()) return;
			handleProducts(code.trim() ? code : lastResult)
		}
	};

	const handleProducts = async (prodCode: string, product?: IProduct) => {
		setNotFound(false);
		let response: IProduct | Error;
		if (product) {
			response = product;
		} else {
			response = await ProductService.getByCode(prodCode);
		}
		const result = response;
		if (result instanceof Error) {
			setNotFound(true);
		} else {
			setLastResult(prodCode);
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

	const handleSubmit = async () => {
		try {
			const data = products.map((prod) => {
				return {
					prod_id: prod.id,
					price: prod.price,
					quantity: prod.quantity
				}
			});

			const dataObs = {
				data: data,
				obs: obs,
			}

			const result = await SaleService.create(dataObs as ISaleObs);
			if (result instanceof Error) return alert('Venda não efetuada.');
			setProducts([]);
			setObs('');
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

	// GROUP HANDLES
	const [selectedGroup, setSelectedGroup] = useState(0);
	const [prodGroup, setProdGroup] = useState<IProduct[]>();
	const [prodTotalCount, setProdTotalCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const handleClickGroup = (group_id: number) => {
		setSelectedGroup(group_id);
		listProductsInGroup(group_id);
	}

	const listProductsInGroup = async (group_id: number) => {
		try {
			setLoading(true);
			const response = await GroupService.getProdsByGroup(group_id, 1, '', 999999999);
			if (response instanceof Error) return;
			setProdGroup(response.data);
			setProdTotalCount(response.totalCount);
			setLoading(false);
		} catch (e) {
			alert(e);
		}
	}

	const handleBack = () => {
		setSelectedGroup(0);
		setProdGroup(undefined);
	}
	return (
		<LayoutMain title="Vender" subTitle="">
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						<Box display={'flex'}>
							<TextField
								fullWidth
								size="small"
								placeholder={'Código'}
								inputRef={codeInputRef}
								onKeyDown={handleEnter}
								value={code} onChange={(e) => setCode(e.target.value)}
								autoComplete="off"
							/>
						</Box>
					</Paper>
					<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						{(notFound && <Alert severity="error">Nenhum produto encontrado com este código !</Alert>)}
						<Box display={'flex'} minHeight={410}>
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
															fontSize="large"
															onClick={() => handleQuantityChange(row.code, -1)}
														/>
														<Box marginTop={1}>
															{row.quantity}
														</Box>
														<ArrowRightRoundedIcon
															sx={{ cursor: 'pointer' }}
															fontSize="large"
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
						<TextField
							rows={3}
							fullWidth
							multiline
							sx={{ mt: 2 }}
							value={obs}
							onChange={(e) => setObs(e.target.value)}
							label="Observações"
							autoComplete="off"
						/>
						<Box display={'flex'} gap={38} marginTop={3}>
							<Button
								variant="contained"
								sx={{ mb: 2, ml: 3 }}
								disabled={products && products.length === 0}
								onClick={handleSubmit}
							>
								<AddShoppingCartRoundedIcon sx={{ mr: 1 }} /> Finalizar
							</Button>
							<Typography variant="h6">Total: R$ {totalPrice.toFixed(2)}</Typography>
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						<Box display={'flex'} justifyContent={'space-between'} p={'3px'}>
							{selectedGroup ?
								<Button onClick={handleBack} variant="outlined"><FastRewindIcon sx={{ mr: 1 }} />Voltar</Button>
								:
								<Typography variant="h6" ml={1}>Grupos</Typography>
							}
							<Button onClick={() => navigate('/grupos')}><SettingsIcon /></Button>
						</Box>
					</Paper>
					<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
						<Box border={1} minHeight={593} my={2}>
							<Grid item container p={2} gap={1}>
								{selectedGroup ?
									<Box width={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
										{!prodTotalCount && !loading && <caption>Nenhum produto encontrado nesse grupo</caption>}
										{prodGroup?.map((prod) =>
											<Box
												key={prod.code}
												gap={15}
												border={1}
												height={40}
												width={'100%'}
												display={'flex'}
												alignItems={'center'}
												sx={{ cursor: 'pointer', ":hover": { backgroundColor: "#eee" } }}
												onClick={() => {
													if (!products.find((pd) => pd.code === prod.code)) {
														handleProducts(prod.code, prod);
													}
												}}
											>
												<Typography variant="body1" ml={1} width={150} noWrap overflow={'hidden'}>{prod.code}</Typography>
												<Typography variant="body1" ml={1} width={300} noWrap overflow={'hidden'}>{prod.name}</Typography>
												{!products.find((pd) => pd.code == prod.code) ?
													<Typography variant="body1" ml={1} width={150} noWrap overflow={'hidden'}>R$ {prod.price}</Typography>
													:
													<Box display={'flex'} ml={1} width={150}>
														<ArrowLeftRoundedIcon
															sx={{ cursor: 'pointer', zIndex: 999999999 }}
															fontSize="large"
															onClick={() => handleQuantityChange(prod.code, -1)}
														/>
														<Box marginTop={1}>
															<Typography>
																{products.find((pd) => pd.code == prod.code)?.quantity}
															</Typography>
														</Box>
														<ArrowRightRoundedIcon
															sx={{ cursor: 'pointer' }}
															fontSize="large"
															onClick={() => handleQuantityChange(prod.code, 1)}
														/>
													</Box>
												}
											</Box>
										)}
									</Box>
									:
									groups?.map((gp) =>
										<Grid
											key={gp.id}
											item
											xs={2.8}
											border={1}
											minHeight={50}
											display={'flex'}
											alignItems={'center'}
											justifyContent={'center'}
											sx={{ cursor: 'pointer', ":hover": { backgroundColor: "#eee" } }}
											onClick={() => handleClickGroup(gp.id)}
										>
											<Typography noWrap overflow={'hidden'}>{gp.name}</Typography>
										</Grid>
									)
								}
							</Grid>
						</Box>
					</Paper>
				</Grid >
			</Grid >
		</LayoutMain >
	);
};