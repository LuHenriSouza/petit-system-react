import { useEffect, useMemo, useState } from "react";
import { IOutputQuery, ProductService } from "../../shared/services/api";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { LayoutMain } from "../../shared/layouts";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import { Box, Button, Paper, Skeleton, TextField, Typography } from "@mui/material";

export const OutputDetail: React.FC = () => {
	const { id } = useParams();
	const [desc, setDesc] = useState('');
	const [output, setOutput] = useState<IOutputQuery>();
	const [searchParams] = useSearchParams();

	const backPage = useMemo(() => {
		return searchParams.get('backPage');
	}, [searchParams]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const outputFetch = await ProductService.getOutputById(Number(id));
				if (outputFetch instanceof Error) return 'output not found';
				setOutput(outputFetch);

				outputFetch.desc && setDesc(outputFetch.desc);

			} catch (e) {

				console.log(e);
			}
		}

		fetchData();
	}, []);

	// const handleSubmit = () => {
	// 	setLoading(true);
	// 	const result = await OutflowService.updateDescById(Number(id), { desc: desc.trim() });

	// 	if (result instanceof Error) {
	// 		return Swal.fire({
	// 			icon: "error",
	// 			title: "Atenção",
	// 			text: "Descrição não pode ser vazia",
	// 			showConfirmButton: true,
	// 		});
	// 	}

	// 	Swal.fire({
	// 		icon: "success",
	// 		title: "Sucesso!",
	// 		text: "Descrição alterada com sucesso!",
	// 		showConfirmButton: true,
	// 	});
	// 	setLoading(false);
	// 	if (outflow) outflow.desc = desc;
	// }

	return (
		<LayoutMain title={"Boleto " + id} subTitle={"Boleto " + id}>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={`/saida/produto?page=${backPage}`}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1 }}>
				<Box margin={5}>
					<Typography variant="h6" margin={1}>{output?.prod_name ? 'Produto: ' + output.prod_name : <Skeleton sx={{ maxWidth: 300 }} />}</Typography>
					<Typography variant="h6" margin={1}>{output?.quantity ? 'Quantidade: ' + output.quantity : <Skeleton sx={{ maxWidth: 300 }} />}</Typography>
					<Typography variant="h6" margin={1}>{output?.reason ? 'Motivo: ' + output.reason : <Skeleton sx={{ maxWidth: 300 }} />}</Typography>
				</Box>
				<Box display={'flex'} flexDirection={'column'} gap={2} margin={2}>
					<TextField
						rows={4}
						fullWidth
						multiline
						sx={{ my: 2 }}
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						label="Descrição"
						id="elevation-multiline-static"
						autoComplete="off"
					/>
					{/* <Button variant="contained" color="primary" size="large" onClick={handleSubmit} sx={{ maxWidth: 250 }} disabled={loading || payment?.desc == desc}>
						Alterar Descrição
					</Button> */}
				</Box>
			</Paper>
		</LayoutMain>
	);
};