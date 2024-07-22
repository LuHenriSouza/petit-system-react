import {
	Box,
	Grid,
	Paper,
	Button,
	TextField,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material';
import { LayoutMain } from '../../shared/layouts';
import { Link, useParams } from 'react-router-dom';
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import { CustomSelect, IMenuItens } from '../../shared/forms/customInputs/CustomSelect';
import { CustomCheckbox } from '../../shared/forms/customInputs/CustomCheckbox';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../shared/hooks';
import { EColumnsOrderBy, FincashService, IResponse } from '../../shared/services/api';

export const FincashResult: React.FC = () => {
	const { debounce } = useDebounce();

	const [rows, setRows] = useState<IResponse[]>();
	const [loading, setLoading] = useState(true);
	const [orderBy, setOrderBy] = useState<keyof typeof EColumnsOrderBy>('quantity');

	enum EOrderBy {
		quantity = 'quantity',
		value_unit = 'solded_price',
		value_total = 'total_value',
	}

	const selectOrderItens: IMenuItens[] = [
		{ text: 'Quantidade', value: EOrderBy.quantity },
		{ text: 'Valor Total', value: EOrderBy.value_total },
		{ text: 'Valor Unitário', value: EOrderBy.value_unit },
	];

	useEffect(() => {
		debounce(() => {
			listData();
		})
	}, [orderBy])

	const listData = async () => {
		try {
			setLoading(true);
			const data = await FincashService.getSaleDataByFincash(Number(id), { column: orderBy, order: 'desc' });
			if (data instanceof Error) return;
			setRows(data);

		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}
	const { id } = useParams();

	return (
		<LayoutMain title='' subTitle=''>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Link to={'/caixa/' + id}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1 }}>
				<Grid container p={2} gap={1} border={1} minHeight={600} my={2}>
					{/* COLUNM 1 */}
					<Grid item xs={2.9} display={'flex'} flexDirection={'column'} gap={1}>
						<Box display={'flex'} flexDirection={'column'} gap={2} border={1} px={2} py={3}>
							<TextField label={'Pesquisa'} />
							<Box display={'flex'} gap={1} alignItems={'center'}>
								<Typography>
									Ordenar por:
								</Typography>
								<CustomSelect menuItens={selectOrderItens} defaultSelected={0} onValueChange={(e) => setOrderBy(e as keyof typeof EColumnsOrderBy)} />
							</Box>
						</Box>
						<Box display={'flex'} flexDirection={'column'} gap={2} border={1} flex={1} px={2} py={2}>
							<Typography variant={'h6'} display={'flex'} justifyContent={'center'}>
								Filtros:
							</Typography>
							<Box display={'flex'} gap={1} alignItems={'center'}>
								<Typography mr={1}>
									Setor:
								</Typography>
								<Box display={'flex'} flexDirection={'column'}>
									<CustomCheckbox menuItens={[{ label: 'Todos', defaultChecked: true }]}></CustomCheckbox>
									<CustomCheckbox menuItens={[{ label: '1' }, { label: '2' }, { label: '3' }, { label: '4' }]}></CustomCheckbox>
								</Box>
							</Box>
						</Box>
					</Grid>
					<Grid item p={2} border={1} xs={9}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Código</TableCell>
									<TableCell>Nome</TableCell>
									<TableCell>Quantidade</TableCell>
									<TableCell>Preço Unitário</TableCell>
									<TableCell>Valor Total</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									rows?.map((row) =>
										<TableRow>
											<TableCell>{row.prod_code}</TableCell>
											<TableCell>{row.prod_name}</TableCell>
											<TableCell>{row.quantity}</TableCell>
											<TableCell>{row.solded_price}</TableCell>
											<TableCell>{row.total_value}</TableCell>
										</TableRow>
									)
								}
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</Paper>
		</LayoutMain>
	);
};