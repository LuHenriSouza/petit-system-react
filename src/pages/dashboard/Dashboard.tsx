import {
	Box,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { LayoutMain } from '../../shared/layouts';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { FincashService, ProductService } from '../../shared/services/api';
import { CustomSelect } from '../../shared/forms/customInputs/CustomSelect';
import { nToBRL } from '../../shared/services/formatters';
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

	const [loadingMonth, setLoadingMonth] = useState(true);
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

	useEffect(() => {
		getSectorData();
		getDataCurrentMonth();
	}, [])

	const getDataCurrentMonth = async () => {
		try {
			setLoadingMonth(true);
			const response = await FincashService.getCurrentMonth();
			console.log('response: ' + response)
			if (response instanceof Error) return console.log('error: ' + response);
			const value = response.map((i) => i.totalValue);
			const date = response.map((i) => new Date(i.finalDate).getTime());
			const invoicing = response.map((i) => i.invoicing);
			setPerMonth({ date, value, invoicing })
		} catch (e) {
			console.error(e);
		} finally {
			setLoadingMonth(false);
		}
	}

	const getSectorData = async () => {
		try {
			setLoadingSector(true);



			// INVOICING
			const resultVAL = await ProductService.getValueBySector();
			if (resultVAL instanceof Error) return;
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

	return (
		<LayoutMain title="Dashboard" subTitle=''>
			<Grid container gap={2}>
				{/* PRIMEIRA LINHA */}
				<Grid item xs={3.5}>
					<CustomPaper borderColor='blueviolet' border>
						<Typography variant='h5'>
							Rendimento Mensal
						</Typography>
						<Typography pl={2} pt={1} variant='h6'>
							R$ 1.000,00
						</Typography>
					</CustomPaper>
				</Grid>
				<Grid item xs={3.5}>
					<CustomPaper borderColor='goldenrod' border>
						<Typography variant='h5'>
							Rendimento Semanal
						</Typography>
						<Typography pl={2} pt={1} variant='h6'>
							R$ 1.000,00
						</Typography>
					</CustomPaper>
				</Grid>
				<Grid item xs={3.5}>
					<CustomPaper borderColor='#32CD32' border>
						<Typography variant='h5'>
							Média Diária
						</Typography>
						<Typography pl={2} pt={1} variant='h6'>
							R$ 1.000,00
						</Typography>
					</CustomPaper>
				</Grid>
				{/* SEGUNDA LINHA */}
				<Grid item xs={7}>
					<CustomPaper height={550} borderColor='blueviolet' border>
						<Box display={'flex'} flexDirection={'column'} p={1}>
							<Typography variant='h5'>
								Rendimento Mensal
							</Typography>
							<CustomSelect menuItens={[]} mt={2} maxWidth={250} mx={4} />
							<LineChart
								loading={loadingMonth}
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
										console.log(dataSeries)
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
						</Box>
					</CustomPaper>
					<CustomPaper height={550} borderColor='#32CD32' border mt={2}>
						<Box display={'flex'} flexDirection={'column'} p={1}>
							<Typography variant='h5'>
								Relação Produtos
							</Typography>
							<CustomSelect menuItens={[]} mt={2} maxWidth={250} mx={4} />

							<BarChart
								dataset={[{ month: 'test', seoul: 100 }, { month: 'test2', seoul: 200 }, { month: 'test3', seoul: 300 }, { month: 'test4', seoul: 350 }]}
								xAxis={[{
									scaleType: 'band',
									dataKey: 'month',
									label: 'Month',
								}]}
								yAxis={[{
									scaleType: 'linear',
								}]}
								series={[{
									dataKey: 'seoul',
									label: 'Produtos',
								}]}
								width={900}
								height={400}
							/>

						</Box>
					</CustomPaper>
				</Grid>
				<Grid item xs={3.61}>
					<CustomPaper height={1117} borderColor='goldenrod' border>
						<Box display={'flex'} flexDirection={'column'} p={1} flex={1}>
							<Typography variant='h5'>
								Setores
							</Typography>
							<Box pl={2.5} mt={3} display={'flex'} flexDirection={'column'}>
								<Box>
									<Typography variant='h6'>
										Estoque:
									</Typography>
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
									<Typography variant='h6' ml={29}>
										Total: {totalStock}
									</Typography>
								</Box>
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
								<Box>
									<Typography variant='h6'>
										Potencial:
									</Typography>
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
									<Typography>
										Total: {totalPrediction}
									</Typography>
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
const CustomPaper: React.FC<ICustomProps> = ({ children, borderColor, minHeight = 100, border, maxHeight, height, mt }) => {
	return (
		<Paper sx={{ backgroundColor: "#fff", borderLeft: border ? 5 : 0, borderLeftColor: borderColor, height, maxHeight, mt }} variant="elevation">
			<Box minHeight={minHeight} display={'flex'} flexDirection={'column'} p={2}>

				{children}
			</Box>
		</Paper>
	)
}