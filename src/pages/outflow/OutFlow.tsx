import { Grid, Paper } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";

export const OutFlow: React.FC = () => {
	return (
		<LayoutMain title="Saidas" subTitle="Adicione saídas ao caixa">
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Paper  variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper  variant="elevation" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
					</Paper>
				</Grid>
			</Grid>
		</LayoutMain>
	);
};