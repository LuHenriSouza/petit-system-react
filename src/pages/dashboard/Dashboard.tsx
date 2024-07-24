import {
	Box,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LayoutMain } from '../../shared/layouts';
import { LineChart, PieChart } from '@mui/x-charts';
import { ProductService } from '../../shared/services/api';

export const Dashboard: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [sectorProdQnt, setSectorProdQnt] = useState<{ id: number, value: number, label: string }[]>([]);
	const [sectorPercent, setSectorPercent] = useState<Record<string, number>>({});
	useEffect(() => {
		getData();
	}, [])

	const getData = async () => {
		try {
			setLoading(true);

			const result = await ProductService.getQuantityBySector();
			if (result instanceof Error) return;
			console.log(result)
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
			setLoading(false);
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
								xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
								series={[
									{
										data: [2, 5.5, 2, 8.5, 1.5, 5],
										color: 'blueviolet',
									}
								]}
								width={900}
								height={400}
								grid={{ vertical: true, horizontal: true }}
								slotProps={{
									popper: {
										sx: {
											'& .MuiChartsTooltip-root': {
												backgroundColor: '#fff',
												border: 1,
											}
										}
									}
								}}
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
								loading={loading}
								colors={['goldenrod', '#32CD32', '#1E90FF', 'blueviolet']}
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