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
} from "@mui/material";
// import Swal from 'sweetalert2';
import { format } from "date-fns";
import './../../shared/css/sweetAlert.css'
import { LayoutMain } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { FincashService, ICashOutflow, IFincash, OutflowService } from "../../shared/services/api";

export const FincashDetail: React.FC = () => {
	const { id } = useParams();
	const [desc, setDesc] = useState('');
	const [loading, setLoading] = useState(true);

	const [fincash, setFincash] = useState<IFincash>();
	const [realBreak, setRealBreak] = useState<number>();
	const [outflows, setOutflows] = useState<{ outflows: ICashOutflow[], total: number }>();
	const [outflowTotalCount, setOutflowTotalCount] = useState(0);

	const [searchParams, setSearchParams] = useSearchParams();

	const outflowPage = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);

	useEffect(() => {
		const fetchData = async () => {
			try {

				const CompleteFetch = await FincashService.getDetailedData(Number(id));
				if (CompleteFetch instanceof Error) return 'Fincash not found';
				const fincash = CompleteFetch.data.data.fincash;
				fincash.obs && setDesc(fincash.obs);

				setFincash(CompleteFetch.data.data.fincash);
				// OUTFLOW
				const outflows = await OutflowService.getAllById(Number(outflowPage), CompleteFetch.data.data.fincash.id, 7);
				if (outflows instanceof Error) return 'Outflows not found';
				const total: number = outflows.data.reduce((accumulator: number, currentValue: ICashOutflow) => accumulator + Number(currentValue.value), 0);
				setOutflows({ outflows: outflows.data, total });
				setOutflowTotalCount(outflows.totalCount);
				if (fincash.finalValue && fincash.totalValue) {
					const TotalCash = (fincash.finalValue - fincash.value) + total;

					const cartao = 0; // TROCAR CARTAO -----------------------------------------------------------------------------------------------------------------------------------------
					const totalValue = TotalCash + cartao;
					const realBreak = totalValue - fincash.totalValue;
					setRealBreak(realBreak);
				}

			} catch (e) {

				console.log(e);
			}
		}

		fetchData();
	}, []);


	// const handleSubmit = async () => {
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
		<LayoutMain title={"Saída " + id} subTitle={"Saída " + id}>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={'/fechamentos'}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1 }}>
				<Box margin={5} display={'flex'} justifyContent={'space-between'}>
					<Box>
						<Typography variant="h4" margin={1}>
							{fincash?.created_at ? `${format(fincash.created_at, 'dd/MM/yy')}` : <Skeleton sx={{ maxWidth: 200 }} />}
						</Typography>
						<Typography variant="h5" margin={1}>
							{fincash?.created_at ? `${format(fincash.created_at, 'HH:mm')} - ${fincash.finalDate ? format(fincash.finalDate, 'HH:mm') : 'Aberto'}` : <Skeleton sx={{ maxWidth: 200 }} />}
						</Typography>
						<Typography variant="h5" margin={1}>
							{fincash?.opener ? 'Caixa: ' + fincash.opener : <Skeleton sx={{ maxWidth: 300 }} />}
						</Typography>
						<Typography variant="h5" margin={1}>
							VENDAS REGISTRADAS: R$ {fincash?.totalValue ? fincash.totalValue : '0.00'}
						</Typography>
					</Box>
					<Box>
						<Box border={1} minHeight={210} minWidth={300} my={2} sx={{ backgroundColor: '#eee' }} display={'flex'} alignItems={'center'} flexDirection={'column'} px={1}>
							<Typography variant="h5" margin={1}>
								Dinheiro
							</Typography>
							<Box minWidth={400}>
								<Typography variant="h5" margin={1}>
									Início: R$ {fincash?.value}
								</Typography>
								<Box display={'flex'}>
									{
										fincash?.isFinished &&
										<>
											<Typography variant="h5" mx={1}>
												Variação:
											</Typography>
											<Typography variant="h5" color={fincash?.finalValue && (fincash.finalValue - fincash.value) < 0 ? '#ef0000' : '#00e000'}>
												R$ {fincash?.finalValue && (fincash.finalValue - fincash.value) > 0 && '+'}{fincash?.finalValue ? (fincash.finalValue - fincash.value).toFixed(2) : ''}
											</Typography>
										</>
									}
								</Box>
								{
									fincash?.isFinished &&
									<Typography variant="h5" margin={1}>
										Fim: R$ {fincash?.finalValue}
									</Typography>
								}
							</Box>
						</Box>
						<Box border={1} minHeight={210} minWidth={300} my={2} sx={{ backgroundColor: '#eee' }} display={'flex'} alignItems={'center'} flexDirection={'column'}>
							<Typography variant="h5" margin={1}>
								Calculo
							</Typography>
							<Box>
								{realBreak}
							</Box>
						</Box>
					</Box>
					<Box border={1} minHeight={400} minWidth={500} my={2} sx={{ backgroundColor: '#eee' }} display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexDirection={'column'} py={2}>
						<Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
							<Typography variant="h5" margin={1}>
								Saídas
							</Typography>

							<Box minWidth={400}>
								<Table>
									<TableBody>
										{outflows?.outflows.map((outflow) =>
											<TableRow>
												<TableCell>
													<Typography variant="h5">
														{outflow.type}
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h5">
														R$ {outflow.value}
													</Typography>
												</TableCell>
												<TableCell>
													<Link to={`/saidas/${outflow.id}?caixa=${fincash?.id}`}>
														<Fab
															size="small"
															color="info"
															onClick={() => console.log('Clique no ícone')}
															sx={{
																backgroundColor: '#5bc0de',
																'&:hover': { backgroundColor: '#6fd8ef' },
															}}
														>
															<VisibilityRoundedIcon color="info" />
														</Fab>
													</Link>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</Box>
						</Box>

						<Box mb={5}>
							<Typography variant="h5">
								Total: R$ {outflows?.total.toFixed(2)}
								<br />
								COLOCAR PAGINACAO
							</Typography>
						</Box>
					</Box>
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
						disabled={loading}

					/>
					<Button variant="contained" color="primary" size="large" sx={{ maxWidth: 250 }} disabled={loading || fincash?.obs == desc}>
						Alterar Descrição
					</Button>
				</Box>
			</Paper>
		</LayoutMain >
	);
};