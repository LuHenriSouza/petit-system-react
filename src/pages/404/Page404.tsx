import { Box, Typography } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";

export const Page404: React.FC = () => {
	return (
		<LayoutMain title="404" subTitle="404">
			<Box
				height={'50vh'}
				display={'flex'}
				alignItems={'center'}
				justifyContent={'center'}
				flexDirection={'column'}
			>
				<Typography variant="h1" fontWeight={'bold'}>404</Typography>
				<Typography variant="h4" fontWeight={'bold'}>Página não Encontrada</Typography>
				
			</Box>
		</LayoutMain>
	);
};