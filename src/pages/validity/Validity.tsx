import {
	Box,
	Grid,
	Paper,
	Alert,
	Table,
	Button,
	Dialog,
	TableRow,
	TextField,
	TableBody,
	TableCell,
	TableHead,
	Typography,
	Pagination,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText,
	Fab,
	Icon,
} from "@mui/material";
import * as yup from 'yup';
import Swal from "sweetalert2";
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from "@mui/icons-material/Undo";
import { useDebounce } from "../../shared/hooks";
import { LayoutMain } from "../../shared/layouts";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { format, addDays, isDate, differenceInDays, startOfDay } from 'date-fns';
import { IProduct, IProductWithValidity, ProductService, ValidityService } from "../../shared/services/api";

const VALIDITY_ROW_LIMIT = 7;
const PRODUCT_ROW_LIMIT = 8;

const validitySchema = yup.object().shape({
	validity: yup.date().required()
});

export const Validity: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { debounce } = useDebounce();

	const [open, setOpen] = useState(false);

	const [prodTotalCount, setProdTotalCount] = useState(0);
	const [prodRows, setProdRows] = useState<IProduct[]>([]);
	const [prodSelectedRow, setProdSelectedRow] = useState(0);

	const prodPage = useMemo(() => {
		return searchParams.get('prodPage') || 1;
	}, [searchParams]);

	const prodSearch = useMemo(() => {
		return searchParams.get('prodSearch') || '';
	}, [searchParams]);

	useEffect(() => {
		debounce(() => {
			listProducts();
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prodPage, prodSearch])

	const listProducts = async () => {
		const response = await ProductService.getAll(Number(prodPage), prodSearch, PRODUCT_ROW_LIMIT);
		if (response instanceof Error) return alert('Erro ao procurar por produtos');
		setProdRows(response.data);
		setProdTotalCount(response.totalCount);
	}


	const [valRows, setValRows] = useState<IProductWithValidity[]>([]);
	const [valTotalCount, setValTotalCount] = useState(0);

	const ValidityPage = useMemo(() => {
		return searchParams.get('ValidityPage') || 1;
	}, [searchParams]);

	useEffect(() => {
		listValidities();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ValidityPage, prodSelectedRow])

	const listValidities = async () => {
		if (prodSelectedRow) {
			const response = await ValidityService.getAllByProd(Number(ValidityPage), VALIDITY_ROW_LIMIT, prodSelectedRow);
			if (response instanceof Error) return alert('Erro ao procurar por validades');
			setValRows(response.data);
			setValTotalCount(response.totalCount);
		} else {
			const response = await ValidityService.getAll(Number(ValidityPage), VALIDITY_ROW_LIMIT);
			if (response instanceof Error) return alert('Erro ao procurar por validades');
			setValRows(response.data);
			setValTotalCount(response.totalCount);
		}
	}


	const [qnt, setQnt] = useState(0);
	const [errorQnt, setErrorQnt] = useState(false);
	const [validity, setValidity] = useState<Date>();
	const [errorDate, setErrorDate] = useState(false);

	const handleProdRowClick = (id: number) => {
		setProdSelectedRow(id);
	}

	const handleCleanClick = () => {
		setProdSelectedRow(0);
	}

	const handleClickOpen = () => {
		setOpen(true);
	}

	const handleClose = () => {
		setQnt(0);
		setOpen(false);
		setErrorQnt(false);
		setErrorDate(false);
	};

	const handleSubmit = async () => {

		const isValid = await validitySchema.isValid({ validity: validity });
		if (!isValid) {
			setErrorDate(true);
			return;
		}

		if (qnt < 1) {
			setErrorQnt(true);
			return;
		}

		if (!validity) {
			setErrorDate(true);
		} else {
			const result = await ValidityService.create(prodSelectedRow, validity, qnt);
			if (result instanceof Error) {
				Swal.fire({
					icon: "error",
					title: "Erro desconhecido ao Cadastrar!",
					text: 'Envie uma reclamação na aba "Suporte"'
				});
			} else {
				Swal.fire({
					icon: "success",
					title: "Validade Cadastrada!",
					showConfirmButton: false,
					timer: 1000
				});
			}
			listValidities();
		}
	}

	const dateColorFinder = (validity: Date): string => {
		if (!isDate(validity)) {
			console.error('Invalid date:', validity);
			return 'textSecondary';
		}

		const currentDate = startOfDay(new Date());
		const oneWeekAhead = addDays(currentDate, 7);
		const twoWeekAhead = addDays(currentDate, 14);

		oneWeekAhead.setDate(currentDate.getDate() + 7);
		twoWeekAhead.setDate(currentDate.getDate() + 14);
		const daysUntilValidity = differenceInDays(validity, currentDate);

		if (daysUntilValidity <= 7) {
			return '#f00'; // Menos de duas semanas
		} else if (daysUntilValidity <= 14) {
			return '#ec0'; // Menos de uma semana
		} else {
			return '';
		}
	}
	const HandleText = (validity: Date): string => {
		if (!isDate(validity)) {
			console.error('Invalid date:', validity);
			return 'textSecondary';
		}

		const currentDate = startOfDay(new Date());
		const daysUntilValidity = differenceInDays(validity, currentDate);


		if (daysUntilValidity == 0) {
			return '(HOJE)';
		} else if (validity < currentDate) {
			return '(VENCIDO)';
		} else {
			return '';
		}
	}
	return (
		<LayoutMain title="Validades" subTitle="Adicione ou gerencie validades">
			<Grid container>
				<Grid item xs={4}>
					<Paper
						sx={{ backgroundColor: "#fff", px: 3, py: 1, mr: 5, mb: 1 }}
						variant="elevation"
					>
						<Box display={'flex'} justifyContent={'space-between'}>
							<TextField
								fullWidth
								size="small"
								autoComplete="off"
								value={prodSearch}
								placeholder={'Pesquisar'}
								onChange={(event) => { setSearchParams((old) => { old.set('prodSearch', event.target.value); return old; }) }}
							/>
						</Box>
					</Paper>
					<Paper
						sx={{ backgroundColor: "#fff", px: 3, py: 1, mr: 5 }}
						variant="elevation"
					>
						<Box minHeight={500}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell width={100}>Código</TableCell>
										<TableCell>Nome</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{prodRows?.map((prod) => (
										<TableRow
											hover
											key={prod.id}
											sx={{ cursor: "pointer" }}
											selected={prodSelectedRow == prod.id}
											onClick={() => handleProdRowClick(prod.id)}
										>
											<TableCell>{prod.code}</TableCell>
											<TableCell>{prod.name}</TableCell>
										</TableRow>
									))}
								</TableBody>
								{prodTotalCount === 0 && (
									<caption>Nenhum produto encontrado</caption>
								)}
							</Table>
						</Box>
						{prodTotalCount > 0 && prodTotalCount > PRODUCT_ROW_LIMIT && (
							<Pagination
								page={Number(prodPage)}
								count={Math.ceil(prodTotalCount / PRODUCT_ROW_LIMIT)}
								onChange={(_, newPage) =>
									setSearchParams((old) => {
										old.set("prodPage", newPage.toString());
										return old;
									})
								}
							/>
						)}


					</Paper>
				</Grid>
				<Grid item xs={8}>
					<Paper
						sx={{ backgroundColor: "#fff", px: 3, py: 1, mr: 5, mb: 1 }}
						variant="elevation"
					>
						<Box display={'flex'} justifyContent={'space-between'}>
							<Button
								variant="outlined"
								onClick={handleCleanClick}
								disabled={!prodSelectedRow}
							>
								<UndoIcon fontSize="small" sx={{ mr: 1 }} />
								Limpar Seleção
							</Button>
							<Button
								variant="outlined"
								onClick={handleClickOpen}
								disabled={!prodSelectedRow}
							>
								<AddIcon sx={{ mr: 1 }} />
								Adicionar Validade
							</Button>
						</Box>
					</Paper>
					<Paper
						sx={{ backgroundColor: "#fff", px: 3, py: 1, mr: 5 }}
						variant="elevation"
					>
						<Box minHeight={500}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Código</TableCell>
										<TableCell>Nome</TableCell>
										<TableCell>Quantidade</TableCell>
										<TableCell>Validade</TableCell>
										<TableCell>Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{valRows.map((val) => (
										<TableRow
											hover
											key={val.id}
										>
											<TableCell>{val.code}</TableCell>
											<TableCell>{val.name}</TableCell>
											<TableCell>
												<TextField
													autoComplete="off"
													sx={{ maxWidth: 80 }}
													inputProps={{ type: 'number' }}
													// onChange={(e) => { setQnt(Number(e.target.value)); setErrorQnt(false); }}
													// onFocus={() => setErrorQnt(false)}
													value={val.quantity}
												/>
											</TableCell>
											<TableCell>
												<Typography variant="body1" color={() => dateColorFinder(new Date(val.validity))}>
													{format(val.validity, 'dd/MM/yyyy ')}{HandleText(new Date(val.validity))}
												</Typography>
											</TableCell>
											<TableCell>
												<Fab size="small" color="success" aria-label="add" sx={{ mr: 2 }} onClick={() => setIsEdit(0)}>
													<Icon>check</Icon>
												</Fab>
												<Fab size="small" color="error" aria-label="add" onClick={() => formRef.current?.submitForm()}>
													<Icon>delete</Icon>
												</Fab></TableCell>
										</TableRow>
									))}
								</TableBody>
								{valTotalCount === 0 && (
									<caption>Nenhum produto encontrado</caption>
								)}
							</Table>
						</Box>
						{valTotalCount > 0 && valTotalCount > VALIDITY_ROW_LIMIT && (
							<Pagination
								page={Number(ValidityPage)}
								count={Math.ceil(valTotalCount / VALIDITY_ROW_LIMIT)}
								onChange={(_, newPage) =>
									setSearchParams((old) => {
										old.set("ValidityPage", newPage.toString());
										return old;
									})
								}
							/>
						)}
					</Paper>
				</Grid>
			</Grid>
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
					{errorQnt && (<Alert severity='warning' sx={{ mb: 1 }}>Quantidade precisa ser maior que 0</Alert>)}
					{errorDate && (<Alert severity='warning' sx={{ mb: 1 }}>Data inválida</Alert>)}
					<DialogContentText mb={4}>
						Cadastrar estoque
					</DialogContentText>
					<Box minHeight={80} display={'flex'} gap={6}>
						<TextField
							autoComplete="off"
							inputProps={{ type: 'date' }}
							// value={validityDate}
							onChange={(e) => {
								const dateString = e.target.value;
								if (dateString) {
									const date = new Date(dateString);
									setValidity(date);
								} else {
									setValidity(undefined);
								}
								setErrorDate(false);
							}}
							onFocus={() => setErrorDate(false)}
						/>
						<TextField
							autoComplete="off"
							label={'Quantidade'}
							sx={{ maxWidth: 140 }}
							inputProps={{ type: 'number' }}
							onChange={(e) => { setQnt(Number(e.target.value)); setErrorQnt(false); }}
							onFocus={() => setErrorQnt(false)}
						/>
					</Box>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} variant='outlined'>Cancelar</Button>
					<Button onClick={handleSubmit} variant='contained'>Cadastrar</Button>
				</DialogActions>
			</Dialog>
		</LayoutMain>
	);
};