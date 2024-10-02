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
import HistoryIcon from '@mui/icons-material/History';
import { nToBRL } from "../../shared/services/formatters";
import { VTextField } from "../../shared/forms/VTextField";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { FincashService, ICashOutflow, IFincash, OutflowService } from "../../shared/services/api";

const OUTFLOW_ROW_LIMIT = 5;

export const EditFincash: React.FC = () => {
	const { id } = useParams();
	const [desc, setDesc] = useState('');

	const [loading, setLoading] = useState(true);
	const [cardLoading, setCardLoading] = useState(false);
	const [reload, setReload] = useState(0);
	const [fincash, setFincash] = useState<IFincash>();
	const [outflows, setOutflows] = useState<{ outflows: ICashOutflow[], total: number }>();

	const formRef = useRef<FormHandles>(null);

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
				fincash.obs && setDesc(fincash.obs);
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

	const cardSubmit = async (data: IFormData) => {
		setCardLoading(true);
		try {
			data.card = data.card.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
			if (fincash) {
				const swal = await Swal.fire({
					title: 'Tem Certeza?',
					text: `Registrar Cartão no Valor de "${nToBRL(Number(data.card))}" ?`,
					icon: 'question',
					iconColor: '#512DA8',
					showCancelButton: true,
					confirmButtonColor: '#512DA8',
					cancelButtonColor: '#aaa',
					cancelButtonText: 'Voltar',
					confirmButtonText: 'Confirmar'
				});
				if (swal.isConfirmed) {
					const dataValidated = await formValidation.validate(data, { abortEarly: false });

					const result = await FincashService.registerCardValue(dataValidated.card, fincash.id);
					if (result instanceof Error) {
						return Swal.fire({
							icon: "error",
							title: "Atenção",
							text: "Algum erro ocorreu ao tentar inserir o valor",
							showConfirmButton: true,
						});
					}

					Swal.fire({
						icon: "success",
						title: "Sucesso!",
						text: "Cartão registrado com sucesso!",
						showConfirmButton: true,
					});
					setReload(1);
				}

			}
		} catch (e) {
			console.log(e);
		} finally {
			setCardLoading(false);
		}
	}

	const changeObs = async () => {
		setLoading(true);
		const result = await FincashService.updateObsById(Number(id), desc.trim());

		if (result instanceof Error) {
			return Swal.fire({
				icon: "error",
				title: "Atenção",
				text: "Erro ao cadastrar Observação",
				showConfirmButton: true,
			});
		}

		Swal.fire({
			icon: "success",
			title: "Sucesso!",
			text: "Observação alterada com sucesso!",
			showConfirmButton: true,
		});
		setLoading(false);
		if (fincash) fincash.obs = desc;
	}

	return (
		<LayoutMain
			title={fincash ? `Caixa: ${format(fincash.created_at, 'dd/MM/yyyy')}` : ''}
			subTitle={'Caixa: ' + fincash?.opener}
		>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={`/caixa/${id}?backPage=${backPage}`}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1 }}>
				<Box display={'flex'} flexDirection={'column'} gap={2} margin={2}>
					<TextField
						rows={4}
						fullWidth
						multiline
						sx={{ mt: 2 }}
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						label="Observação"
						id="elevation-multiline-static"
						autoComplete="off"
						disabled={loading}

					/>
					<Button variant="contained" color="primary" size="large" sx={{ maxWidth: 250 }} disabled={loading || fincash?.obs == desc} onClick={changeObs}>
						Alterar Observação
					</Button>
				</Box>
			</Paper>
		</LayoutMain >
	);
};