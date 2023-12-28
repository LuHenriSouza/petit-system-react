import { Paper } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";

export const NewProduct: React.FC = () => {
	return (
		<>
			<LayoutMain title="Novo Produto" subTitle="Cadastre um Produto">
				<Paper component={Paper} variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
					
				</Paper>
			</LayoutMain>
		</>
	);
};