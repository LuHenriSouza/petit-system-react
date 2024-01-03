import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Icon, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, useMediaQuery, useTheme } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { SupplierService, ISupplier } from "../../shared/services/api";
import { Environment } from "../../shared/environment";
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2'
import './../../shared/css/sweetAlert.css'

export const Suppliers: React.FC = () => {
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const { debounce } = useDebounce();
	const [searchParams, setSearchParams] = useSearchParams();

	const [rows, setRows] = useState<ISupplier[]>([]);
	const [totalCount, setTotalCount] = useState(0);

	const [open, setOpen] = useState(false);

	const [name, setName] = useState('');

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const search = useMemo(() => {
		return searchParams.get('search') || ''
	}, [searchParams])

	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);

	useEffect(() => {
		debounce(() => {
			listSuppliers();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, page, debounce]);

	const listSuppliers = () => {
		SupplierService.getAll(Number(page), search)
			.then((result) => {
				// setIsLoading(false);
				if (result instanceof Error) {
					alert(result.message);
				} else {
					setTotalCount(result.totalCount);
					setRows(result.data);
				}
			});
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
			<Paper variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Fornecedor</TableCell>
								<TableCell align="center">Ações</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) =>
							(
								<TableRow key={row.id}>
									<TableCell>{row.name}</TableCell>
									<TableCell align="center">
										<Fab size="medium" color="error" aria-label="add" sx={{ mr: 2, ...(smDown && { mb: 1 }) }} onClick={() => handleDelete(row.id, row.name)}>
											<Icon>delete</Icon>

										</Fab>
									</TableCell>
								</TableRow >
							)
							)}
						</TableBody>
						{totalCount === 0 && (
							<caption>Nenhum fornecedor encontrado</caption>
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
				<DialogTitle>Cadastrar</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Cadastrar fornecedor
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
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancelar</Button>
					<Button onClick={handleSubmit}>Cadastrar</Button>
				</DialogActions>
			</Dialog>
		</LayoutMain>
	);
};