import Swal from 'sweetalert2'
import { format } from "date-fns";
import './../../shared/css/sweetAlert.css'
import { useEffect, useState } from "react";
import { LayoutMain } from "../../shared/layouts";
import { Link, useParams } from "react-router-dom";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import { Box, Button, Paper, Skeleton, TextField, Typography } from "@mui/material";
import { FincashService, ICashOutflow, IFincash, ISupplier, OutflowService, SupplierService } from "../../shared/services/api";

export const OutflowDetail: React.FC = () => {
	const { id } = useParams();
	const [desc, setDesc] = useState('');
	const [fincash, setFincash] = useState<IFincash>();
	const [supplier, setSupplier] = useState<ISupplier>();
	const [outflow, setOutflow] = useState<ICashOutflow>();

	useEffect(() => {
		const fetchData = async () => {
			try {

				const outflowFetch = await OutflowService.getById(Number(id));
				if (outflowFetch instanceof Error) return 'outflow not found';
				setOutflow(outflowFetch);

				outflowFetch.desc && setDesc(outflowFetch.desc);

				const fincashFetch = await FincashService.getById(Number(outflowFetch.fincash_id));
				if (fincashFetch instanceof Error) return 'fincash not found';
				setFincash(fincashFetch);

				const supplierFetch = await SupplierService.getById(Number(outflowFetch.supplier_id))
				if (supplierFetch instanceof Error) return 'supplier not found';
				setSupplier(supplierFetch);

			} catch (e) {

				console.log(e);
			}
		}

		fetchData();
	}, []);


	const handleSubmit = async () => {
		const result = await OutflowService.updateDescById(Number(id), { desc: desc.trim() });

		if (result instanceof Error) {
			return Swal.fire({
				icon: "error",
				title: "Atenção",
				text: "Descrição não pode ser vazia",
				showConfirmButton: true,
			});
		}

		Swal.fire({
			icon: "success",
			title: "Sucesso!",
			text: "Descrição alterada com sucesso!",
			showConfirmButton: true,
		});

	}

	return (
		<LayoutMain title={"Saída " + id} subTitle={"Saída " + id}>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={'/saidas'}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1 }}>
				<Box margin={5}>
					<Typography variant="h4" margin={1}>{fincash?.opener ? 'Caixa: ' + fincash.opener : <Skeleton sx={{ maxWidth: 300 }} />}</Typography>
					<Typography variant="h5" margin={1}>{outflow?.created_at ? ("Hora: " + format(outflow.created_at, 'HH:mm')) : <Skeleton sx={{ maxWidth: 200 }} />}</Typography>
					<Typography variant="h5" margin={1}>{outflow?.type ? 'Tipo: ' + outflow.type : <Skeleton sx={{ maxWidth: 300 }} />}</Typography>
					{supplier && (<Typography variant="h6" margin={1}>{supplier.name ? 'Fornecedor: ' + supplier.name : <Skeleton sx={{ maxWidth: 200 }} />}</Typography>)}
					<Typography variant="h6" margin={1}>{outflow?.value ? 'Valor: R$ ' + outflow.value : <Skeleton sx={{ maxWidth: 150 }} />}</Typography>
				</Box>
				<Box display={'flex'} flexDirection={'column'} gap={2} margin={2}>
					<TextField
						rows={4}
						fullWidth
						multiline
						sx={{ mt: 2 }}
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						label="Descrição"
						id="elevation-multiline-static"
						autoComplete="off"
					/>
					<Button variant="contained" color="primary" size="large" onClick={handleSubmit} sx={{ maxWidth: 250 }}>
						Alterar Descrição
					</Button>
				</Box>
			</Paper>
		</LayoutMain>
	);
};