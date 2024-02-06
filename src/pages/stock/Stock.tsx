import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { IProductWithStock, ProductService, StockService } from "../../shared/services/api";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import AddIcon from '@mui/icons-material/Add';

const STOCK_ROW_LIMIT = 7;

export const Stock: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { debounce } = useDebounce();

	const [rows, setRows] = useState<IProductWithStock[]>();
	const [totalCount, setTotalCount] = useState(0);
	const [open, setOpen] = useState(false);
	const [allProducts, setAllProducts] = useState<{ label: string, id: number }[]>();
	const [selectedProd, setSelecterProd] = useState(0);
	const [qntStock, setQntStock] = useState(0);
	
	const stockPage = useMemo(() => {
		return searchParams.get('stockPage') || 1;
	}, [searchParams]);

	const stockSearch = useMemo(() => {
		return searchParams.get('stockSearch') || '';
	}, [searchParams]);

	useEffect(() => {
		debounce(() => {
			listStocks();
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stockPage, stockSearch]);

	const handleClickOpen = () => {
		setOpen(true);
		getAllProducts();
	};

	const handleClose = () => {
		setOpen(false);
		setSelecterProd(0);
	};

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

	const listStocks = async () => {
		const response = await StockService.getAll(Number(stockPage), STOCK_ROW_LIMIT, stockSearch);
		if (response instanceof Error) {
			alert("Ocorreu algum erro");
		} else {
			setRows(response.data);
			setTotalCount(response.totalCount);
		}
	}

	const handleSubmit = async () => {
		if (!selectedProd) {
			setErrorSelect(true)
		} else {
			StockService.create(selectedProd, qntStock)
		}
	}

	return (
		<LayoutMain title="Estoque" subTitle="Adicione ou gerencie o estoque">
			<Paper
				sx={{ backgroundColor: "#fff", px: 3, py: 1, mr: 5, mb: 1 }}
				variant="elevation"
			>
				<Box display={'flex'} justifyContent={'space-between'}>
					<TextField
						size="small"
						placeholder={'Pesquisar'}
						value={stockSearch}
						onChange={(event) => { setSearchParams((old) => { old.set('stockSearch', event.target.value); return old; }) }}
						autoComplete="off"
					/>
					<Button variant="contained" onClick={handleClickOpen}><AddIcon sx={{ mr: 1 }} />Adicionar</Button>
				</Box>
			</Paper>
			<Paper
				sx={{ backgroundColor: "#fff", px: 3, py: 3, mr: 5, mb: 1 }}
				variant="elevation"
			>
				<Box minHeight={500} m={1}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell width={200}>Código</TableCell>
								<TableCell>Produto</TableCell>
								<TableCell>Estoque</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows?.map((row) => (
								<TableRow
									key={row.code}
									// selected={productSelectedRow == row.id}
									hover
									sx={{ cursor: "pointer" }}
								// onClick={() => handleProductRowClick(row.id)}
								>
									<TableCell>{row.code}</TableCell>
									<TableCell>{row.name}</TableCell>
									<TableCell>{row.stock}</TableCell>
								</TableRow>
							))}
						</TableBody>
						{totalCount === 0 && (
							<caption>Nenhum grupo encontrado</caption>
						)}
					</Table>
				</Box>
				{totalCount > 0 && totalCount > STOCK_ROW_LIMIT && (
					<Pagination
						page={Number(stockPage)}
						count={Math.ceil(totalCount / STOCK_ROW_LIMIT)}
						onChange={(_, newPage) =>
							setSearchParams((old) => {
								old.set("stockPage", newPage.toString());
								return old;
							})
						}
					/>
				)}
			</Paper>

			{/* ------------------- ------------------- ADD MODAL ------------------- ------------------- */}
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				sx={{
					"& .MuiDialog-paper":
						{ backgroundColor: "#fff", }
				}}>
				<DialogTitle>Adicionar</DialogTitle>
				<DialogContent>
					<Box minHeight={250}>
						<DialogContentText mb={2}>
							Cadastrar estoque
						</DialogContentText>
						<Autocomplete
							disablePortal
							id="combo-box"
							options={allProducts ?? []}
							sx={{ width: 300 }}

							renderOption={(props, option) => {
								return (
									<li {...props} key={option.id}>
										{option.label + ' ' + option.id}
									</li>
								);
							}}
							renderInput={(params) => <TextField {...params} label="Produto" />}
							onChange={(_, newValue) => {
								if (newValue) {
									setSelecterProd(newValue.id);
								}
							}}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancelar</Button>
					<Button onClick={handleSubmit}>Cadastrar</Button>
				</DialogActions>
			</Dialog>
		</LayoutMain>
	);
};