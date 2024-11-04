import {
	Box,
	Button,
	CircularProgress,
	Divider,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { LayoutMain } from '../../shared/layouts';
import { LineChart, PieChart } from '@mui/x-charts';
import { FincashService, PaymentService, ProductService } from '../../shared/services/api';
import { nToBRL } from '../../shared/services/formatters';
import { CustomDatePicker } from '../../shared/forms/customInputs/CustomDatePicker';
import { DateRange } from '@mui/x-date-pickers-pro';
export const Dashboard: React.FC = () => {

	const daysOfWeek = {
		'Sun': 'Dom',
		'Mon': 'Seg',
		'Tue': 'Ter',
		'Wed': 'Qua',
		'Thu': 'Qui',
		'Fri': 'Sex',
		'Sat': 'Sab',
	};

	const formatDateWithCustomDay = (date: Date) => {
		// Obter o nome do dia da semana em inglês
		const dayOfWeek = format(date, 'EEE') as keyof typeof daysOfWeek;
		// Mapear o nome do dia da semana para o formato desejado
		const abbreviatedDay = daysOfWeek[dayOfWeek] || '';
		// Formatando a data final
		const formattedDate = format(date, 'dd/MM/yyyy');
		return `${formattedDate} - ${abbreviatedDay}`;
	};

	const [loadingLineChart, setLoadingLineChart] = useState(true);
	const [perMonth, setPerMonth] = useState<{ date: (number | string)[], value: number[], invoicing: number[] }>({ date: [], value: [], invoicing: [] });
	const [loadingSector, setLoadingSector] = useState(true);

	// INVOICING
	const [sectorInvoicing, setSectorInvoicing] = useState<{ id: number, value: number, label: string }[]>([]);
	const [sectorPercentInvoicing, setSectorPercentInvoicing] = useState<Record<string, number>>({});
	const [totalInvoicing, setTotalInvoicing] = useState(0);

	// STOCK QUANTITY
	const [sectorSTOCK, setSectorSTOCK] = useState<{ id: number, value: number, label: string }[]>([]);
	const [sectorPercentSTOCK, setSectorPercentSTOCK] = useState<Record<string, number>>({});
	const [totalStock, setTotalStock] = useState(0);

	// STOCK VALUE PREDICTION
	const [sectorPrediction, setSectorPrediction] = useState<{ id: number, value: number, label: string }[]>([]);
	const [sectorPercentPrediction, setSectorPercentPrediction] = useState<Record<string, number>>({});
	const [totalPrediction, setTotalPrediction] = useState(0);

	// const [sectorProdQnt, setSectorProdQnt] = useState<{ id: number, value: number, label: string }[]>([]);
	// const [sectorProdRelation, setSectorProdRelation] = useState<{ id: number, value: number, label: string }[]>([]);
	// const [sectorPercentRelation, setSectorPercentRelation] = useState<Record<string, number>>({});
	// const [sectorPercent, setSectorPercent] = useState<Record<string, number>>({});

	const today = new Date();
	const [att, setAtt] = useState(false);
	const [dateToFetch, setDateToFetch] = useState<DateRange<Date>>([
		startOfMonth(today),
		endOfMonth(today)
	]);
	const [lineChartInvoicing, setLineChartInvoicing] = useState(0);
	const [lastFetch, setLastFetch] = useState<DateRange<Date>>([
		startOfMonth(today),
		endOfMonth(today)
	]);

	useEffect(() => {
		getSectorData();
	}, [])

	useEffect(() => {
		getSectorInvoicingByDate();
		getDataByDate();
	}, [att])

	const getDataByDate = async () => {
		try {
			if (dateToFetch[0] && dateToFetch[1]) {
				setLoadingLineChart(true);
				const response = await FincashService.getDataByDate(dateToFetch[0], dateToFetch[1]);
				if (response instanceof Error) return console.error('error: ' + response);
				if (!response.length) {
					setPerMonth({ date: [], value: [], invoicing: [] })
					setLineChartInvoicing(0);
					setLastFetch(dateToFetch);
				}

				let total: number | Error = 0;
				const fincashOpen = await FincashService.getOpenFincash();
				if (!(fincashOpen instanceof Error)) {
					if (fincashOpen.created_at >= dateToFetch[0] && fincashOpen.created_at <= dateToFetch[1]) {
						total = await FincashService.getTotalByFincash(fincashOpen.id);
						if (!(total instanceof Error)) {
							if (response[response.length - 1].first_id == fincashOpen.id) response[response.length - 1].total_registered_value = total;
						}
					}
				}
				if (total instanceof Error) total = 0;
				const value = response.map((i) => i.total_registered_value);
				console.log(response);
				const LineChartInvoicing = response.map((i) => i.total_invoicing).reduce((a, b) => { console.log(a, b); return Number(a ?? 0) + Number(b ?? 0) }, total);
				console.log(lineChartInvoicing, 'aqui');
				const date = response.map((i) => new Date(i.day).getTime());
				const invoicing = response.map((i) => i.total_invoicing);

				setPerMonth({ date, value, invoicing })
				setLineChartInvoicing(LineChartInvoicing);
				setLastFetch(dateToFetch);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoadingLineChart(false);
		}
	}

	const getSectorData = async () => {
		try {
			setLoadingSector(true);

			// STOCK QUANTITY
			const resultSTOCK = await ProductService.getStockBySector();
			if (resultSTOCK instanceof Error) return;
			const objSTOCK = resultSTOCK.map((i) => {
				return {
					id: i.sector,
					value: i.stock,
					label:
						i.sector == 1 ? 'Bebidas'
							: i.sector == 2 ? 'Chocolates'
								: i.sector == 3 ? 'Salgadinhos'
									: i.sector == 4 ? 'Sorvetes' : 'Erro'
				}
			});
			setSectorSTOCK(objSTOCK);
			const percentSTOCK: Record<string, number> = {}
			const totalSTOCK = objSTOCK.map((i) => i.value).reduce((a, b) => Number(a) + Number(b));
			setTotalStock(totalSTOCK);
			for (const o of objSTOCK) {
				percentSTOCK[o.label] = o.value * 100 / totalSTOCK;
			}
			setSectorPercentSTOCK(percentSTOCK);



			// STOCK VALUE PREDICTION
			const resultINV = await ProductService.getStockValueBySector();
			if (resultINV instanceof Error) return;
			const objINV = resultINV.map((i) => {
				return {
					id: i.sector,
					value: i.value,
					label:
						i.sector == 1 ? 'Bebidas'
							: i.sector == 2 ? 'Chocolates'
								: i.sector == 3 ? 'Salgadinhos'
									: i.sector == 4 ? 'Sorvetes' : 'Erro'
				}
			});
			setSectorPrediction(objINV)
			const percentINV: Record<string, number> = {}
			const totalINV = objINV.map((i) => i.value).reduce((a, b) => Number(a) + Number(b));
			setTotalPrediction(totalINV);
			for (const o of objINV) {
				percentINV[o.label] = o.value * 100 / totalINV;
			}
			setSectorPercentPrediction(percentINV);



			// QUANTITY
			// const resultQNT = await ProductService.getQuantityBySector();
			// if (resultQNT instanceof Error) return;
			// const objQNT = resultQNT.map((i) => {
			// 	return {
			// 		id: i.sector,
			// 		value: i.quantity,
			// 		label:
			// 			i.sector == 1 ? 'Bebidas'
			// 				: i.sector == 2 ? 'Chocolates'
			// 					: i.sector == 3 ? 'Salgadinhos'
			// 						: i.sector == 4 ? 'Sorvetes' : 'Erro'
			// 	}
			// });
			// setSectorProdQnt(objQNT)
			// const percentQNT: Record<string, number> = {}
			// const totalQNT = objQNT.map((i) => i.value).reduce((a, b) => a + b);
			// for (const o of objQNT) {
			// 	percentQNT[o.label] = o.value * 100 / totalQNT;
			// }
			// setSectorPercent(percentQNT);

			// RELATION
			// const objarr = []
			// for (let i = 0; i < objQNT.length; i++) {
			// 	objarr.push({
			// 		id: objQNT[i].id,
			// 		value: objVAL[i].value / objQNT[i].value,
			// 		label: objQNT[i].label
			// 	});
			// }
			// setSectorProdRelation(objarr);
			// const record: Record<string, number> = {}
			// const total = objarr.map((i) => i.value).reduce((a, b) => Number(a) + Number(b));
			// for (const o of objarr) {
			// 	record[o.label] = o.value * 100 / total;
			// }
			// setSectorPercentRelation(record);


		} catch (e) {
			console.log(e);
		} finally {
			setLoadingSector(false);
		}
	}

	const getSectorInvoicingByDate = async () => {
		if (dateToFetch[0] && dateToFetch[1]) {
			const resultVAL = await ProductService.getValueBySector(dateToFetch[0], dateToFetch[1]);
			if (resultVAL instanceof Error) return console.error('error: ' + resultVAL);
			if (!resultVAL.length) setTotalInvoicing(0);
			const objVAL = resultVAL.map((i) => {
				return {
					id: i.sector,
					value: i.value,
					label:
						i.sector == 1 ? 'Bebidas'
							: i.sector == 2 ? 'Chocolates'
								: i.sector == 3 ? 'Salgadinhos'
									: i.sector == 4 ? 'Sorvetes' : 'Erro'
				}
			});
			setSectorInvoicing(objVAL);
			const percentVAL: Record<string, number> = {}
			const totalVAL = objVAL.map((i) => i.value).reduce((a, b) => Number(a) + Number(b));
			setTotalInvoicing(totalVAL);
			for (const o of objVAL) {
				percentVAL[o.label] = o.value * 100 / totalVAL;
			}
			setSectorPercentInvoicing(percentVAL);
		}
	}

	const [totalPayments, setTotalPayments] = useState(0);
	useEffect(() => {
		(async () => {
			if (!dateToFetch[0] || !dateToFetch[1]) return;
			const result = await PaymentService.getTotalByDate(dateToFetch[0], dateToFetch[1]);
			if (result instanceof Error) return;
			setTotalPayments(result);
			console.log('result', result);
		})();
	}, [att]);
	return (
		<LayoutMain title="Dashboard" subTitle=''>
			<Grid container gap={2}>
				<Grid item xs={3.5}>
					<Box gap={5} display={'flex'} flexDirection={'column'}>
						<CustomPaper borderColor='blueviolet' border>
							<Typography variant='h5'>
								Potencial
							</Typography>
							<Typography pl={2} pt={1} variant='h6'>
								{nToBRL(totalPrediction)}
							</Typography>
						</CustomPaper>
						<CustomPaper borderColor='blueviolet' border>
							<Typography variant='h5'>
								Estoque
							</Typography>
							<Typography pl={2} pt={1} variant='h6'>
								{totalStock}
							</Typography>
						</CustomPaper>
						<CustomPaper borderColor='#a00' border>
							<Typography variant='h5'>
								Gastos (Boleto)
							</Typography>
							<Typography pl={2} pt={1} variant='h6'>
								{nToBRL(totalPayments)}
							</Typography>
						</CustomPaper>
					</Box>
				</Grid>
				<Grid item xs={7.5}>
					<CustomPaper borderColor='blueviolet' border>
						<Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
							<CustomDatePicker onChange={setDateToFetch} loading={loadingLineChart} />
							<Button
								variant={'contained'}
								sx={{ mt: 2, backgroundColor: 'blueviolet', width: 600 }}
								onClick={() => { setLoadingLineChart(true); setAtt(!att); }}
								disabled={loadingLineChart || (!dateToFetch[0] || !dateToFetch[1] || lastFetch == dateToFetch)}
							>
								{
									loadingLineChart ?
										<CircularProgress size={24} />
										:
										'Atualizar'
								}
							</Button>
						</Box>
					</CustomPaper>
				</Grid>
				<Grid item xs={7}>
					<CustomPaper height={450} borderColor='#32CD32' border>
						<Box display={'flex'} justifyContent={'space-between'} mr={5}>
							<Typography variant='h5'>
								Faturamento:
							</Typography>
							<Typography variant='h6'>
								{nToBRL(lineChartInvoicing)}
							</Typography>
						</Box>
						<LineChart
							loading={loadingLineChart}
							xAxis={[{
								data: perMonth?.date,
								scaleType: 'utc',
								valueFormatter: (v) => {
									if (v) {
										return format(new Date(v), 'dd');
									} else return 'invalid date';
								},
							},
							{
								data: perMonth?.date,
								scaleType: 'utc',
								valueFormatter: (v) => {
									if (v) {
										return format(new Date(v), 'dd');
									} else return 'invalid date';
								},
							}]} //DATA
							series={[
								{
									data: perMonth?.value, //VALOR
									color: 'blueviolet',
								},
								{
									data: perMonth?.invoicing, //VALOR
									color: '#1E90FF',
								}
							]}
							width={900}
							height={400}
							slots={{
								axisContent: (props) => {
									const { axisValue, dataIndex, series } = props;
									if (!axisValue || dataIndex === undefined || dataIndex === null || !series) return '';

									const dataSeries = Array.isArray(series) ? series : [];
									const value = dataSeries[0].data;
									const invoicing = dataSeries[1].data;

									return (
										<Box
											sx={{
												padding: 2,
												backgroundColor: "white",
												border: "1px solid black",
												borderRadius: 1
											}}
										>
											<Typography>
												{formatDateWithCustomDay(new Date(axisValue))}
												<hr />
												<Box display={'flex'} alignItems={'center'} gap={1}>
													<Box sx={{ backgroundColor: series[0].color, width: 13, height: 13 }} />{`Registrado: ${nToBRL(Number(value[dataIndex]))}`}
												</Box>
												<hr />
												<Box display={'flex'} alignItems={'center'} gap={1}>
													<Box sx={{ backgroundColor: series[1].color, width: 13, height: 13 }} />{`Faturamento: ${nToBRL(Number(invoicing[dataIndex]))}`}
												</Box>
											</Typography>
										</Box>
									);
								}
							}}
							grid={{ horizontal: true }}
						/>
					</CustomPaper>
					<Box mb={2}>
						{/* <CustomPaper height={400} borderColor='#32CD32' border>
							
						</CustomPaper> */}
					</Box>
					<CustomPaper height={775} borderColor='blueviolet' border>
						<Box display={'flex'} flexDirection={'column'} p={1} flex={1}>
							<Box pl={2.5} mt={3} display={'flex'} flexDirection={'column'}>
								<Box>
									<Box display={'flex'} justifyContent={'space-between'} mr={5}>
										<Typography variant='h5'>
											Estoque:
										</Typography>
										<Typography variant='h6' ml={29}>
											{totalStock}
										</Typography>
									</Box>
									<PieChart
										loading={loadingSector}
										sx={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', }}
										colors={['#1E90FF', 'goldenrod', '#32CD32', '#aA4Bf2']}
										series={[
											{
												data: sectorSTOCK,
												highlightScope: { faded: 'global', highlighted: 'item' },
												faded: { innerRadius: 30, additionalRadius: -5, color: 'gray' },
												innerRadius: 30,
												outerRadius: 100,
												paddingAngle: 3,
												cornerRadius: 5,
												startAngle: -90,
												endAngle: 270,
												cx: 150,
												cy: 150,
												arcLabel(item) {
													if (item.label) return `${sectorPercentSTOCK[item.label].toFixed(1)}%`
													return '';
												},
											},
										]}
										slotProps={{
											itemContent: {
												sx: {
													backgroundColor: '#fff',
													border: 1,
													fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
													'& .MuiChartsTooltip-labelCell, & .MuiChartsTooltip-valueCell': {
														color: 'black',
													}
												}
											}
										}}
										height={300}
									/>
								</Box>
								<Divider sx={{ mb: 5 }} />
								{/* 
								<Box>
									<Typography variant='h6'>
										Faturamento:
									</Typography>
									<PieChart
										loading={loadingSector}
										sx={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', }}
										colors={['#1E90FF', 'goldenrod', '#32CD32', '#aA4Bf2']}
										series={[
											{
												data: sectorInvoicing,
												highlightScope: { faded: 'global', highlighted: 'item' },
												faded: { innerRadius: 30, additionalRadius: -5, color: 'gray' },
												innerRadius: 30,
												outerRadius: 100,
												paddingAngle: 3,
												cornerRadius: 5,
												startAngle: -90,
												endAngle: 270,
												cx: 150,
												cy: 150,
												arcLabel(item) {
													if (item.label) return `${sectorPercentInvoicing[item.label].toFixed(1)}%`
													return '';
												},
											},
										]}
										slotProps={{
											itemContent: {
												sx: {
													backgroundColor: '#fff',
													border: 1,
													fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
													'& .MuiChartsTooltip-labelCell, & .MuiChartsTooltip-valueCell': {
														color: 'black',
													}
												}
											}
										}}
										height={300}
									/>
									<Typography variant='h6' ml={20}>
										Total: {nToBRL(totalInvoicing)}
									</Typography>
								</Box>
								*/}
								<Box>
									<Box display={'flex'} justifyContent={'space-between'} mr={5}>
										<Typography variant='h5'>
											Potencial:
										</Typography>
										<Typography variant='h6'>
											{nToBRL(totalPrediction)}
										</Typography>
									</Box>
									<PieChart
										loading={loadingSector}
										sx={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', }}
										colors={['#1E90FF', 'goldenrod', '#32CD32', '#aA4Bf2']}
										series={[
											{
												data: sectorPrediction,
												highlightScope: { faded: 'global', highlighted: 'item' },
												faded: { innerRadius: 30, additionalRadius: -5, color: 'gray' },
												innerRadius: 30,
												outerRadius: 100,
												paddingAngle: 3,
												cornerRadius: 5,
												startAngle: -90,
												endAngle: 270,
												cx: 150,
												cy: 150,
												arcLabel(item) {
													if (item.label) return `${sectorPercentPrediction[item.label].toFixed(1)}%`
													return '';
												},
											},
										]}
										slotProps={{
											itemContent: {
												sx: {
													backgroundColor: '#fff',
													border: 1,
													fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
													'& .MuiChartsTooltip-labelCell, & .MuiChartsTooltip-valueCell': {
														color: 'black',
													}
												}
											}
										}}
										height={300}
									/>
								</Box>
							</Box>
						</Box>
					</CustomPaper>
				</Grid>
				<Grid item xs={4}>
					<CustomPaper height={450} borderColor='#32CD32' border>
						<Box display={'flex'} flexDirection={'column'} p={1} flex={1}>
							<Box pl={2.5} mt={3} display={'flex'} flexDirection={'column'}>
								<Box>
									<Box display={'flex'} justifyContent={'space-between'} mr={5}>
										<Typography variant='h5'>
											Registrado:
										</Typography>
										<Typography variant='h6'>
											{nToBRL(totalInvoicing)}
										</Typography>
									</Box>
									<PieChart
										loading={loadingSector}
										sx={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', }}
										colors={['#1E90FF', 'goldenrod', '#32CD32', '#aA4Bf2']}
										series={[
											{
												data: sectorInvoicing,
												highlightScope: { faded: 'global', highlighted: 'item' },
												faded: { innerRadius: 30, additionalRadius: -5, color: 'gray' },
												innerRadius: 30,
												outerRadius: 100,
												paddingAngle: 3,
												cornerRadius: 5,
												startAngle: -90,
												endAngle: 270,
												cx: 150,
												cy: 150,
												arcLabel(item) {
													if (item.label && sectorPercentInvoicing[item.label]) return `${sectorPercentInvoicing[item.label].toFixed(1)}%`
													return '';
												},
											},
										]}
										slotProps={{
											itemContent: {
												sx: {
													backgroundColor: '#fff',
													border: 1,
													fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
													'& .MuiChartsTooltip-labelCell, & .MuiChartsTooltip-valueCell': {
														color: 'black',
													}
												}
											}
										}}
										height={300}
									/>
								</Box>
							</Box>
						</Box>
					</CustomPaper>
				</Grid>
			</Grid>
		</LayoutMain>
	);
};
// PAPER -----------------------------------------------
interface ICustomProps {
	children?: React.ReactNode;
	borderColor?: string;
	minHeight?: number;
	height?: number;
	maxHeight?: number;
	border?: boolean;
	mt?: number;
}
const CustomPaper: React.FC<ICustomProps> = ({ children, borderColor, minHeight = 121, border, maxHeight, height, mt }) => {
	return (
		<Paper sx={{ backgroundColor: "#fff", borderLeft: border ? 5 : 0, borderLeftColor: borderColor, height, maxHeight, mt }} variant="elevation">
			<Box minHeight={minHeight} display={'flex'} flexDirection={'column'} p={2}>

				{children}
			</Box>
		</Paper>
	)
}