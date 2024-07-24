import { Box, Grid, Paper, Typography } from '@mui/material';
import { LayoutMain } from '../../shared/layouts';
import { LineChart, PieChart } from '@mui/x-charts';

export const Dashboard: React.FC = () => {
	const data = [
		{ id: 0, value: 10, label: 'Setor 1' },
		{ id: 1, value: 10, label: 'Setor 2' },
		{ id: 2, value: 80, label: 'Setor 3' },
		{ id: 3, value: 5, label: 'Setor 4' },
	];
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
					<CustomPaper borderColor='yellowgreen' border>
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
								Média Diária
							</Typography>
							<LineChart
								xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
								series={[
									{
										data: [2, 5.5, 2, 8.5, 1.5, 5],
									},
								]}
								width={900}
								height={400}
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
								series={[
									{
										data,
										highlightScope: { faded: 'global', highlighted: 'item' },
										faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
										innerRadius: 30,
										outerRadius: 100,
										paddingAngle: 3,
										cornerRadius: 5,
										startAngle: -90,
										endAngle: 270,
										cx: 150,
										cy: 150,
									},
								]}
								height={600}
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