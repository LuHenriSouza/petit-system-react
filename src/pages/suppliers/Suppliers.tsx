import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Icon, Pagination, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useMediaQuery, useTheme } from "@mui/material";
import { SupplierService, ISupplier } from "../../shared/services/api";
import { Environment } from "../../shared/environment";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutMain } from "../../shared/layouts";
import { useDebounce } from "../../shared/hooks";
import AddIcon from '@mui/icons-material/Add';
import './../../shared/css/sweetAlert.css';
import Swal from 'sweetalert2';


const NUMBER_OF_SKELETONS = Array(7).fill(null);


export const Suppliers: React.FC = () => {
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const { debounce } = useDebounce();
	const [searchParams, setSearchParams] = useSearchParams();

	const [rows, setRows] = useState<ISupplier[]>([]);
	const [totalCount, setTotalCount] = useState(0);

	const [open, setOpen] = useState(false);

	const [name, setName] = useState('');

	const [isEdit, setIsEdit] = useState(false);
	const [idForEdit, setIdForEdit] = useState(0);

	const [loading, setLoading] = useState(true);
	const [loadingPage, setLoadingPage] = useState(false);


	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setName('');
		debounce(() => {
			debounce(() => {
				setIsEdit(false);
			});
		});
	};

	const search = useMemo(() => {
		return searchParams.get('search') || ''
	}, [searchParams])

	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);

	useEffect(() => {
		setLoading(true);
		setLoadingPage(true);
		debounce(() => {
			listSuppliers();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, page, debounce]);

	const listSuppliers = async () => {
		const result = await SupplierService.getAll(Number(page), search)

		if (result instanceof Error) {
			alert(result.message);
		} else {
			setTotalCount(result.totalCount);
			setRows(result.data);
		}

		setLoading(false);
		setLoadingPage(false);

	};

	const handleDelete = (id: number, name: string) => {
		Swal.fire({
			title: 'Tem Certeza?',
			text: `Apagar "${name}" ?`,
			icon: 'warning',
			iconColor: theme.palette.error.main,
			showCancelButton: true,
			confirmButtonColor: theme.palette.error.main,
			cancelButtonColor: '#aaa',
			confirmButtonText: 'Deletar'
		}).then((result) => {
			if (result.isConfirmed) {
				SupplierService.deleteById(id).then((result) => {
					if (result instanceof Error) {
						alert(result.message);
					} else {
						Swal.fire({
							title: 'Deletado!',
							text: 'Produto apagado.',
							icon: 'success',
						});
						listSuppliers();
					}
				});
			}
		});
	}

	const handleEdit = (id: number, name: string) => {
		setName(name);
		setIsEdit(true);
		setIdForEdit(id);
		handleClickOpen();
	}

	const handleSubmit = async () => {
		const result = await SupplierService.create({ name: name.trim() });
		if (result instanceof Error) {
			return Swal.fire({
				icon: "error",
				title: "Atenção",
				text: "Nome deve ter pelo menos 3 caracteres",
				showConfirmButton: true,
			});
		}

		Swal.fire({
			icon: "success",
			title: "Sucesso!",
			text: "Fornecedor adicionado com sucesso!",
			showConfirmButton: false,
			timer: 1000
		});
		setName('');
		listSuppliers();

	}

	const handleSubmitEdit = async () => {
		const result = await SupplierService.updateById(idForEdit, { name: name.trim() });
		if (result instanceof Error) {
			return Swal.fire({
				icon: "error",
				title: "Atenção",
				text: "Nome deve ter pelo menos 3 caracteres",
				showConfirmButton: true,
			});
		}

		Swal.fire({
			icon: "success",
			title: "Sucesso!",
			text: "Fornecedor editado com sucesso!",
			showConfirmButton: false,
			timer: 1000
		});
		setName('');
		setIdForEdit(0);
		setIsEdit(false);
		listSuppliers();
		handleClose();
	}

	return (
		<LayoutMain title="Fornecedores" subTitle="Gerencie os fornecedores">
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }} variant="elevation">
				<Box display={'flex'} justifyContent={'space-between'}>
					<TextField
						size="small"
						placeholder={'Pesquisar'}
						value={search}
						onChange={(event) => { setSearchParams({ search: event.target.value }, { replace: true }) }}
						autoComplete="off"
					/>
					{(!smDown && <Button variant="contained" onClick={handleClickOpen}><AddIcon sx={{ mr: 1 }} />Novo Fornecedor</Button>)}
					{(smDown && <Button variant="contained" onClick={handleClickOpen} sx={{ ml: 2 }}><AddIcon /></Button>)}
				</Box>
			</Paper>
			<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto', minHeight: 600 }}>
				<Box minHeight={640}>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Fornecedor</TableCell>
									<TableCell align="center">Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>

								{
									!loading ?
										rows.map((row) =>
										(
											<TableRow key={row.id}>
												<TableCell>{row.name}</TableCell>
												<TableCell align="center">
													<Fab size="medium" color="error" sx={{ mr: 2, ...(smDown && { mb: 1 }) }} onClick={() => handleDelete(row.id, row.name)}>
														<Icon>delete</Icon>

													</Fab>
													<Fab size="medium" color="warning" sx={{ mr: 2, ...(smDown && { mb: 1 }) }} onClick={() => handleEdit(row.id, row.name)}>
														<Icon>edit</Icon>

													</Fab>
												</TableCell>
											</TableRow >
										)
										)
										:
										NUMBER_OF_SKELETONS.map((_, index) => (
											<TableRow key={index}>
												<TableCell >
													<Skeleton sx={{ minHeight: 40, maxWidth: 250 }} />
												</TableCell>
												<TableCell align="center">
													<Fab disabled size='medium' sx={{ mr: 2 }}></Fab>
													<Fab disabled size='medium'></Fab>
												</TableCell>
											</TableRow>
										))
								}
							</TableBody>

							{totalCount === 0 && !loading && (
								<caption>Nenhum fornecedor encontrado</caption>
							)}
						</Table>
					</TableContainer>
				</Box>
				{(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
					<Pagination
						sx={{ m:1 }}
						disabled={loadingPage}
						page={Number(page)}
						count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
						onChange={(_, newPage) => setSearchParams({ search, page: newPage.toString() }, { replace: true })}
						siblingCount={smDown ? 0 : 1}
					/>
				)}
			</Paper>
			{/* ADD MODAL */}
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				sx={{
					"& .MuiDialog-paper":
						{ backgroundColor: "#fff", }
				}}>
				<DialogTitle>{isEdit ? 'Editar' : 'Cadastrar'}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{isEdit ? 'Editar' : 'Cadastrar'} fornecedor
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Nome"
						type="text"
						fullWidth
						variant="standard"
						onChange={e => setName(e.target.value)}
						value={name}
						autoComplete="off"
						onKeyDown={(e) => { if (e.code === 'Enter' || e.key === 'Enter') isEdit ? handleSubmitEdit() : handleSubmit(); }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancelar</Button>
					<Button onClick={isEdit ? handleSubmitEdit : handleSubmit}>{isEdit ? 'Editar' : 'Cadastrar'}</Button>
				</DialogActions>
			</Dialog>
		</LayoutMain >
	);
};