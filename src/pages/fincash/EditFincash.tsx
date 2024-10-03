import {
	Fab,
	Box,
	Table,
	Paper,
	Button,
	TableRow,
	Skeleton,
	TableCell,
	TextField,
	TableBody,
	Typography,
	Pagination,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { format } from "date-fns";
import './../../shared/css/sweetAlert.css';
import { FormHandles } from "@unform/core";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import { VForm } from "../../shared/forms/VForm";
import { LayoutMain } from "../../shared/layouts";
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import { nToBRL } from "../../shared/services/formatters";
import { VTextField } from "../../shared/forms/VTextField";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { FincashService, ICashOutflow, IFincash, OutflowService, SupplierService } from "../../shared/services/api";
import { IMenuItens, VSelect } from "../../shared/forms/VSelect";
import { EOutflowType } from "../outflow/enum/EOutflowType";

const OUTFLOW_ROW_LIMIT = 5;

export const EditFincash: React.FC = () => {
	const { id } = useParams();

	const [loading, setLoading] = useState(true);
	const [cardLoading, setCardLoading] = useState(false);
	const [reload, setReload] = useState(0);
	const [fincash, setFincash] = useState<IFincash>();
	const [outflows, setOutflows] = useState<{ outflows: ICashOutflow[], total: number }>();

	const EditFormRef = useRef<FormHandles>(null);

	const [outflowTotalCount, setOutflowTotalCount] = useState(0);
	const [loadingOutflows, setLoadingoutflows] = useState(false);

	const [searchParams, setSearchParams] = useSearchParams();

	const outflowPage = useMemo(() => {
		return searchParams.get('outflowPage') || 1;
	}, [searchParams]);

	const backPage = useMemo(() => {
		return searchParams.get('backPage');
	}, [searchParams]);

	useEffect(() => {
		if (fincash) {
			listOutflow(fincash.id);
		}
	}, [outflowPage, fincash]);

	useEffect(() => {
		const fetchData = async () => {
			try {

				const CompleteFetch = await FincashService.getById(Number(id));
				if (CompleteFetch instanceof Error) return 'Fincash not found';
				const fincash = CompleteFetch;
				if (!fincash.isFinished) {
					const result = await FincashService.getTotalByFincash(fincash.id);
					if (!(result instanceof Error)) {
						fincash.totalValue = result;
					}
				}
				if (fincash.finalValue == null) fincash.finalValue = 0;
				if (fincash.totalValue == null) fincash.totalValue = 0;
				if (fincash.cardValue == null || reload == 2) fincash.cardValue = 0;

				setFincash(fincash);

			} catch (e) {

				console.log(e);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [reload]);

	const listOutflow = async (fincash_id: number) => {
		// OUTFLOW
		try {
			setLoadingoutflows(true);
			const outflows = await OutflowService.getAllById(Number(outflowPage), fincash_id, OUTFLOW_ROW_LIMIT);
			if (outflows instanceof Error) return 'Outflows not found';
			const getTotal = await OutflowService.getTotalByFincash(fincash_id);
			if (!(getTotal instanceof Error)) {
				const total = Number(getTotal);
				setOutflows({ outflows: outflows.data, total });
				setOutflowTotalCount(outflows.totalCount);
			}
		} catch (e) { console.error(e) } finally { setLoadingoutflows(false); }
	}

	interface IFormDataValidated {
		card: number;
	}

	interface IFormData {
		card: string;
	}

	const formValidation: yup.Schema<IFormDataValidated> = yup.object().shape({
		card: yup.number().required().min(0)
	});


	// MODAL ENVIRONMENT
	const selectManuItens: IMenuItens[] = [
		{ text: 'Alimentação', value: EOutflowType.Alimentacao },
		{ text: 'Transporte', value: EOutflowType.Transporte },
		{ text: 'Fornecedor', value: EOutflowType.Fornecedor },
		{ text: 'Sangria', value: EOutflowType.Sangria },
		{ text: 'Outro', value: EOutflowType.Outro }
	];

	const OutflowFormRef = useRef<FormHandles>(null);
	const [outflowLoading, setOutflowLoading] = useState(false);
	const [isSupplier, setIsSupplier] = useState(false);
	const [open, setOpen] = useState(false);
	const [editOutflow, setEditOutflow] = useState<ICashOutflow>();
	const [suppliers, setSuppliers] = useState<IMenuItens[]>([]);

	const handleOpen = (outflow?: ICashOutflow) => {
		setEditOutflow(outflow);
		if (outflow?.type == EOutflowType.Fornecedor)
			setIsSupplier(true);
		setOpen(true);

	}

	const handleClose = () => {
		setOpen(false);
		setTimeout(() => {
			setEditOutflow(undefined);
			setIsSupplier(false);
		}, 500)
	}

	const handleValueChange = async (selectedValue: string) => {
		if (selectedValue === EOutflowType.Fornecedor) {
			setIsSupplier(true);
			try {
				if (suppliers.length <= 0) {
					const result = await SupplierService.getAll(undefined, undefined, 99999)
					if (result instanceof Error) {
						alert('Erro ao buscar Fornecedores');
					} else {
						result.data.map((data) => {
							const object = { text: data.name, value: `${data.id}` }
							setSuppliers((old) => [...old, object]);
						})
					}
				}
			} catch (e) {
				alert(e);
			}
		} else {
			setIsSupplier(false);
		}
	}

	return (
		<LayoutMain
			title={fincash ? `Caixa: ${format(fincash.created_at, 'dd/MM/yyyy')}` : ''}
			subTitle={'Editar Caixa'}
		>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={`/caixa/${id}?backPage=${backPage}`}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1 }}>
				<Box margin={5} display={'flex'} justifyContent={'space-between'}>
					{fincash ?
						<VForm onSubmit={() => { }} ref={EditFormRef}>
							<Box minWidth={780}>
								{/* <Box maxWidth={500}> */}
								<VTextField name="name" label={'Nome'} valueDefault={fincash.opener} disabled={loading} />
								<Divider sx={{ my: 4 }} />
								<Box gap={2} display={'flex'} >
									<VTextField name="value" label={'Início'} cash valueDefault={nToBRL(fincash.value)} disabled={loading} />
									<VTextField name="finalValue" label={'Final'} cash valueDefault={nToBRL(fincash.finalValue)} disabled={loading} />
								</Box>
								<Divider sx={{ my: 2 }} />
								<VTextField name="cardValue" cash label={'Cartão'} valueDefault={nToBRL(fincash.cardValue)} disabled={loading} />
								<Divider sx={{ my: 4 }} />
								{/* </Box> */}
								<VTextField
									name="obs"
									rows={4}
									fullWidth
									multiline
									valueDefault={fincash.obs ?? ''}
									label="Observação"
									id="elevation-multiline-static"
									autoComplete="off"
									disabled={loading}
								/>
								<Button variant="contained" size="large" sx={{ mt: 2 }} fullWidth disabled={loading} onClick={() => { }}>
									EDITAR CAIXA
								</Button>
							</Box>
						</VForm>
						:
						<Box display={'flex'} justifyContent={'center'} gap={5}>
							<Box minWidth={300}>
								<TextField label={'Nome'} disabled />
								<Divider sx={{ my: 2 }} />
								<Box gap={2} display={'flex'} flexDirection={'column'}>
									<TextField label={'Início'} disabled />
									<TextField label={'Final'} disabled />
								</Box>
							</Box>
							<TextField label={'Cartão'} disabled />
						</Box>
					}
					<Box border={1} minHeight={500} minWidth={600} my={2} sx={{ backgroundColor: '#eee' }} display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexDirection={'column'} py={2}>
						<Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
							<Button
								variant="contained"
								sx={{ my: 2 }}
								onClick={() => handleOpen()}
							>
								<AddIcon sx={{ mr: 1 }} /> Adicionar Saída
							</Button>

							<Box minWidth={400} minHeight={200}>
								<Table>
									<TableBody>
										{outflows?.outflows.map((outflow) =>
											<TableRow key={outflow.id}>
												<TableCell>
													<Typography variant="h5">
														{outflow.type}
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h5">
														{nToBRL(outflow.value)}
													</Typography>
												</TableCell>
												<TableCell>
													<Fab
														size="small"
														color="warning"
														sx={{ mr: 2 }}
														onClick={() => handleOpen(outflow)}
													>
														<EditIcon color="info" />
													</Fab>
													<Fab
														size="small"
														color="error"
													>
														<DeleteIcon color="info" />
													</Fab>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</Box>
							{outflowTotalCount > 0 && (
								<Pagination
									sx={{ m: 2 }}
									disabled={loadingOutflows}
									page={Number(outflowPage)}
									count={Math.ceil(outflowTotalCount / OUTFLOW_ROW_LIMIT)}
									onChange={(_, newPage) => setSearchParams((old) => {
										old.set("outflowPage", newPage.toString());
										return old;
									})}
									siblingCount={0}
								/>
							)}
						</Box>

						<Box mb={5}>
							<Typography variant="h5">
								Total: {nToBRL(outflows?.total)}
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>
			{/* ------------------- ------------------- EDIT/ADD MODAL ------------------- ------------------- */}
			<Dialog
				maxWidth='md'
				open={open}
				onClose={handleClose}
				fullWidth
				sx={{
					"& .MuiDialog-paper":
						{ backgroundColor: "#fff", }
				}}>
				<DialogTitle>{editOutflow ? 'Editar' : 'Adicionar'}</DialogTitle>
				<DialogContent>
					<DialogContentText mb={4}>
						{editOutflow ? 'Editar' : 'Adicionar'} saída
					</DialogContentText>
					<Box minHeight={100} px={3}>
						<VForm ref={OutflowFormRef} onSubmit={() => { }}>
							<Box display={'flex'} flexDirection={'column'} gap={3} margin={3} minWidth={540}>
								<Box display={'flex'} gap={5}>
									<Box width={200}>
										<VSelect
											name="type"
											label="Tipo"
											menuItens={selectManuItens}
											onValueChange={handleValueChange}
											defaultSelected={editOutflow?.type}
											messageError="Tipo não pode ser vazio"
										/>
									</Box>
									{isSupplier &&
										<Box width={300}>
											<VSelect
												name="supplier_id"
												label="Fornecedor"
												menuItens={suppliers.length > 0 ? suppliers : [{ text: "Nenhum fornecedor cadastrado", value: "" }]}
												messageError="Fornecedor não pode ser vazio"
												defaultSelected={editOutflow?.supplier_id ?? undefined}
											/>
										</Box>
									}
								</Box>
								<VTextField name="value" label="Valor" cash sx={{ maxWidth: 170 }} autoComplete="off" valueDefault={nToBRL(editOutflow?.value)} />
								<VTextField
									name="desc"
									rows={4}
									fullWidth
									multiline
									label="Descrição"
									id="elevation-multiline-static"
									autoComplete="off"
									valueDefault={editOutflow?.desc ?? undefined}
								/>
								<Button variant="contained" onClick={() => OutflowFormRef.current?.submitForm()} disabled={outflowLoading}>Confirmar</Button>
							</Box>
						</VForm>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color={'error'} variant='outlined'>Cancelar</Button>
				</DialogActions>
			</Dialog>
		</LayoutMain >
	);
};