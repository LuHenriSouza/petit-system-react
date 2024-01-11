import Swal from 'sweetalert2'
import { format } from "date-fns";
import './../../shared/css/sweetAlert.css'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LayoutMain } from "../../shared/layouts";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
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
				<Box minHeight={450} margin={5}>
					<Typography variant="h4" margin={1}>Caixa: {fincash?.opener}</Typography>
					<Typography variant="h5" margin={1}>{outflow?.created_at ? ("Hora: " + format(outflow.created_at, 'HH:mm')) : 'Data não disponível'}</Typography>
					<Typography variant="h5" margin={1}>Tipo: {outflow?.type}</Typography>
					{supplier && (<Typography variant="h6" margin={1}>Fornecedor: {supplier.name}</Typography>)}
					<Typography variant="h6" margin={1}>Valor: R$ {outflow?.value}</Typography>
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
					<Button variant="contained" color="primary" style={{ marginTop: '16px' }} size="large" onClick={handleSubmit}>
						Alterar Descrição
					</Button>
				</Box>
			</Paper>
		</LayoutMain>
	);
};