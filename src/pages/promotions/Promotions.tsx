import {
	Fab,
	Box,
	Grid,
	Table,
	Paper,
	Button,
	TableRow,
	Skeleton,
	TextField,
	TableCell,
	TableHead,
	TableBody,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";
import { LayoutMain } from "../../shared/layouts";

const GROUP_ROW_LIMIT = 5;

const NUMBER_OF_GROUP_SKELETONS = Array(GROUP_ROW_LIMIT).fill(null);


export const Promotions: React.FC = () => {
	return (
		<LayoutMain title="Promoções" subTitle="Gerencie promoções">
			<Grid container>
				<Grid item xs={4}>
					<Paper
						sx={{ backgroundColor: "#fff", px: 3, py: 1, mr: 5, mb: 1 }}
						variant="elevation"
					>
						<Box display={"flex"} justifyContent={"space-between"}>
							<TextField
								size="small"
								placeholder={"Pesquisar"}
								autoComplete="off"
							/>
							<Button variant="contained">
								<AddIcon />
							</Button>
						</Box>
					</Paper>
					<Paper
						sx={{
							backgroundColor: "#fff",
							px: 3,
							py: 1,
							mr: 5,
							minHeight: 600,
						}}
						variant="elevation"
					>
						<Box minHeight={470}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Nome</TableCell>
										<TableCell align="right">Ações</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										NUMBER_OF_GROUP_SKELETONS.map((_, index) => (
											<TableRow key={index}>
												<TableCell >
													<Skeleton sx={{ minHeight: 40, maxWidth: 250 }} />
												</TableCell>
												<TableCell align="right">
													<Fab disabled size='medium'></Fab>
												</TableCell>
											</TableRow>
										))
									}
								</TableBody>
							</Table>
						</Box>
						{/* {groupTotalCount > 0 && groupTotalCount > GROUP_ROW_LIMIT && (
							<Pagination
								disabled={groupLoadingPage}
								sx={{ m: 2 }}
								page={Number(groupPage)}
								count={Math.ceil(groupTotalCount / GROUP_ROW_LIMIT)}
								onChange={(_, newPage) =>
									setSearchParams((old) => {
										old.set("groupPage", newPage.toString());
										return old;
									})
								}
							/>
						)} */}
					</Paper>
				</Grid>
				<Grid item xs={8}>
					<Paper
						sx={{ backgroundColor: "#fff", mr: 4, px: 3, py: 1, mb: 1 }}
						variant="elevation"
					>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Button
								variant="outlined"
							// onClick={handleCleanClick}
							// disabled={!groupSelectedRow}
							>
								<UndoIcon fontSize="small" sx={{ mr: 1 }} />
								Limpar Seleção
							</Button>
							<Button
								variant="outlined"
							// onClick={handleClickOpen}
							// disabled={!groupSelectedRow}
							>
								<AddIcon sx={{ mr: 1 }} />
								Adicionar Produto
							</Button>
						</Box>
					</Paper>
					<Paper
						sx={{
							backgroundColor: "#fff",
							mr: 4,
							px: 3,
							py: 1,
							minHeight: 600,
						}}
						variant="elevation"
					>
						<Box minHeight={470}>

						</Box>
					</Paper>
				</Grid>
			</Grid>
		</LayoutMain>
	);
};