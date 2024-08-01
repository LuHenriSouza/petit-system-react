import {
	Box,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { LayoutMain } from '../../shared/layouts';
import { LineChart, PieChart } from '@mui/x-charts';
import { FincashService, ProductService } from '../../shared/services/api';
export const Dashboard: React.FC = () => {
	const [loadingMonth, setLoadingMonth] = useState(true);
	const [perMonth, setPerMonth] = useState<{ date: (number | string)[], value: number[], invoicing: number[] }>({ date: [], value: [], invoicing: [] });
	const [loadingSector, setLoadingSector] = useState(true);
	const [sectorProdQnt, setSectorProdQnt] = useState<{ id: number, value: number, label: string }[]>([]);
	const [sectorPercent, setSectorPercent] = useState<Record<string, number>>({});
	useEffect(() => {
		getDataSector();
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
	const getDataSector = async () => {
		try {
			setLoadingSector(true);

			const result = await ProductService.getQuantityBySector();
			if (result instanceof Error) return;
			const obj = result.map((i) => {
				return {
					id: i.sector,
					value: i.quantity,
					label:
						i.sector == 1 ? 'Bebidas'
							: i.sector == 2 ? 'Chocolates'
								: i.sector == 3 ? 'Salgadinhos'
									: i.sector == 4 ? 'Sorvetes' : 'Erro'
				}
			});
			setSectorProdQnt(obj)
			const record: Record<string, number> = {}
			const total = obj.map((i) => i.value).reduce((a, b) => a + b);
			for (const o of obj) {
				record[o.label] = o.value * 100 / total;
			}
			setSectorPercent(record);
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
					<CustomPaper height={500} borderColor='blueviolet' border>
						<Box display={'flex'} flexDirection={'column'} p={1}>
							<Typography variant='h5'>
								Rendimento Mensal
							</Typography>
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
													{format(new Date(axisValue), "dd/MM/yyyy")}
													<hr />
													<Box display={'flex'} alignItems={'center'} gap={1}>
														<Box sx={{ backgroundColor: series[0].color, width: 13, height: 13 }} />{`Registrado: R$ ${value[dataIndex]}`}
													</Box>
													<hr />
													<Box display={'flex'} alignItems={'center'} gap={1}>
														<Box sx={{ backgroundColor: series[1].color, width: 13, height: 13 }} />{`Faturamento: R$ ${invoicing[dataIndex]}`}
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
				</Grid>
				<Grid item xs={3.61}>
					<CustomPaper height={500} borderColor='goldenrod' border>
						<Box display={'flex'} flexDirection={'column'} p={1} flex={1}>
							<Typography variant='h5'>
								Setores
							</Typography>
							<PieChart
								loading={loadingSector}
								sx={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', }}
								colors={['goldenrod', '#32CD32', '#1E90FF', '#aA4Bf2']}
								series={[
									{
										data: sectorProdQnt,
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
											if (item.label) return `${sectorPercent[item.label].toFixed(1)}%`
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
}
const CustomPaper: React.FC<ICustomProps> = ({ children, borderColor, minHeight = 100, border, maxHeight, height }) => {
	return (
		<Paper sx={{ backgroundColor: "#fff", borderLeft: border ? 5 : 0, borderLeftColor: borderColor, height, maxHeight }} variant="elevation">
			<Box minHeight={minHeight} display={'flex'} flexDirection={'column'} p={2}>

				{children}
			</Box>
		</Paper>
	)
}