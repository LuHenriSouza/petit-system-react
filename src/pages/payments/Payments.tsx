import { Paper } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";

export const Payments: React.FC = () => {
	return (
		<LayoutMain title="Boletos" subTitle="Gerencie seus boletos">
			<Paper
				sx={{ backgroundColor: "#fff", px: 3, py: 1, mr: 5, mb: 1 }}
				variant="elevation"
			>
			</Paper>
			<Paper
				sx={{ backgroundColor: "#fff", px: 3, py: 3, mr: 5, mb: 1 }}
				variant="elevation"
			>
				
			</Paper>
		</LayoutMain>
	);
};