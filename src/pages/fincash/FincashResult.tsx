import {
	Box,
	Grid,
	Paper,
	Table,
	Button,
	Skeleton,
	TableRow,
	TableCell,
	TextField,
	TableHead,
	TableBody,
	Pagination,
	Typography,
} from '@mui/material';
import { useDebounce } from '../../shared/hooks';
import { LayoutMain } from '../../shared/layouts';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';
import { CustomRadio } from '../../shared/forms/customInputs/CustomRadio';
import { CustomCheckbox } from '../../shared/forms/customInputs/CustomCheckbox';
import { CustomSelect, IMenuItens } from '../../shared/forms/customInputs/CustomSelect';
import { EColumnsOrderBy, FincashService, GroupService, IResponse, OrderByObj } from '../../shared/services/api';
import { nToBRL } from '../../shared/services/formatters';

export const FincashResult: React.FC = () => {
	const DEFAULT_LIMIT = 10
	const NUMBER_OF_SKELETONS = Array(DEFAULT_LIMIT).fill(null);

	const [searchParams, setSearchParams] = useSearchParams();
	const { debounce } = useDebounce();

	const [rows, setRows] = useState<IResponse[]>();
	const [groups, setGroups] = useState<IMenuItens[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [orderBy, setOrderBy] = useState<OrderByObj>({ column: 'quantity', order: 'desc', sectors: [1, 2, 3, 4] });

	const search = useMemo(() => {
		return searchParams.get('search') || ''
	}, [searchParams])

	const page = useMemo(() => {
		return searchParams.get('page') || 1;
	}, [searchParams]);

	const backPage = useMemo(() => {
		return searchParams.get('backPage') || 1;
	}, [searchParams]);

	enum EOrderBy {
		quantity = 'quantity',
		value_unit = 'solded_price',
		value_total = 'total_value',
		name = 'prod_name',
		code = 'prod_code'
	}

	const selectOrderItens: IMenuItens[] = [
		{ text: 'Quantidade', value: EOrderBy.quantity },
		{ text: 'Valor Total', value: EOrderBy.value_total },
		{ text: 'Valor Unitário', value: EOrderBy.value_unit },
		{ text: 'Nome', value: EOrderBy.name },
		{ text: 'Código', value: EOrderBy.code },
	];

	useEffect(() => {
		debounce(() => {
			listData();
		})
	}, [orderBy, page, search])
	useEffect(() => {
		setSearchParams((old) => {
			old.delete('page');
			return old;
		});
	}, [search, orderBy])
	useEffect(() => {
		console.log(orderBy.sectors)
	}, [orderBy])
	const listData = async () => {
		try {
			setLoading(true);
			const [data, groups] = await Promise.all([FincashService.getSaleDataByFincash(Number(id), orderBy, Number(page), DEFAULT_LIMIT, search), GroupService.getAll(1, '', 999999)]);
			if (data instanceof Error) return;
			setRows(data.data);
			setTotalCount(data.totalCount);
			if (groups instanceof Error) return;
			setGroups(groups.data.map((g) => { return { value: String(g.id), text: g.name } }));
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
					<Link to={'/caixa/' + id + '?backPage=' + backPage}>
						<Button variant="contained"> <ReplyAllRoundedIcon sx={{ mr: 1 }} /> Voltar </Button>
					</Link>
				</Box>
			</Paper>
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1 }}>
				<Grid container p={2} gap={1} border={1} minHeight={600} my={2}>
					{/* COLUNM 1 */}
					<Grid item xs={3.4} display={'flex'} flexDirection={'column'} gap={1}>
						<Box display={'flex'} flexDirection={'column'} gap={2} border={1} px={2} py={3}>
							<TextField
								label={'Pesquisa'}
								autoComplete='off'
								onChange={(event) => {
									setSearchParams((old) => {
										old.set("search", event.target.value.toString());
										return old;
									})
								}}
							/>
							<Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
								<Typography>
									Ordenar por:
								</Typography>
								<CustomSelect minWidth={150} menuItens={selectOrderItens} defaultSelected={0} onValueChange={(e) => setOrderBy({ ...orderBy, column: e as keyof typeof EColumnsOrderBy })} />
								<CustomRadio sx={{ ml: 2.5 }} menuItens={[{ label: 'Crescente', value: 'asc' }, { label: 'Decrescente', value: 'desc' }]} onValueChange={(e) => setOrderBy({ ...orderBy, order: e as 'asc' | 'desc' })} defaultChecked='desc' />
							</Box>
						</Box>
						<Box display={'flex'} flexDirection={'column'} gap={2} border={1} flex={1} px={2} py={2}>
							<Typography variant={'h6'} display={'flex'} justifyContent={'center'}>
								Filtros:
							</Typography>
							<Box display={'flex'} gap={3} alignItems={'baseline'}>
								<Typography mr={1}>
									Setor:
								</Typography>
								<Box display={'flex'} flexDirection={'column'}>
									<CustomCheckbox
										defaultChecked
										menuItens={
											[
												{ id: '1', label: '1 - Bebidas', defaultChecked: true },
												{ id: '2', label: '2 - Chocolates', defaultChecked: true },
												{ id: '3', label: '3 - Salgadinhos', defaultChecked: true },
												{ id: '4', label: '4 - Sorvetes', defaultChecked: true }
											]
										}
										disabled={loading}
										onValueChange={e => setOrderBy({ ...orderBy, sectors: e.map(e => Number(e)) })}
										flexDirection='column'
									/>
								</Box>
							</Box>
							<Box display={'flex'} alignItems={'center'} mt={2}>
								<Typography mr={3}>
									Grupo:
								</Typography>
								<CustomSelect menuItens={[{ text: 'Todos', value: ' ' }, ...groups]} onValueChange={(e) => setOrderBy({ ...orderBy, group_id: Number(e) })} minWidth={250} defaultSelected={0}/>
							</Box>
						</Box>
					</Grid>
					<Grid item p={2} border={1} xs={8.5}>
						<Box minHeight={600}>

							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Código</TableCell>
										<TableCell>Nome</TableCell>
										{/* <TableCell>Setor</TableCell> */}
										<TableCell>Quantidade</TableCell>
										<TableCell>Preço Unitário</TableCell>
										<TableCell>Valor Total</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										rows ?
											rows.map((row) =>
												<TableRow key={row.prod_id}>
													<TableCell>{row.prod_code}</TableCell>
													<TableCell>{row.prod_name}</TableCell>
													{/* <TableCell>{row.prod_sector}</TableCell> */}
													<TableCell>{row.quantity}</TableCell>
													<TableCell>{nToBRL(row.solded_price)}</TableCell>
													<TableCell>{nToBRL(row.total_value)}</TableCell>
												</TableRow>
											)
											:
											NUMBER_OF_SKELETONS.map((_, index) =>
												<TableRow key={index}>
													<TableCell >
														<Skeleton sx={{ minHeight: 40, width: 140 }} />
													</TableCell>
													<TableCell >
														<Skeleton sx={{ minHeight: 40, width: 200 }} />
													</TableCell>
													{/* <TableCell >
														<Skeleton sx={{ minHeight: 40, width: 20 }} />
													</TableCell> */}
													<TableCell >
														<Skeleton sx={{ minHeight: 40, width: 40 }} />
													</TableCell>
													<TableCell >
														<Skeleton sx={{ minHeight: 40, width: 60 }} />
													</TableCell>
													<TableCell >
														<Skeleton sx={{ minHeight: 40, width: 80 }} />
													</TableCell>
												</TableRow>
											)
									}
								</TableBody>
							</Table>
						</Box>
						{(totalCount > 0 && totalCount > DEFAULT_LIMIT) && (
							<Pagination
								sx={{ m: 1 }}
								disabled={loading}
								page={Number(page)}
								count={Math.ceil(totalCount / DEFAULT_LIMIT)}
								onChange={(_, newPage) => {
									setSearchParams((old) => {
										old.set("page", newPage.toString());
										return old;
									})
								}}
							/>
						)}
					</Grid>
				</Grid>
			</Paper>
		</LayoutMain>
	);
};