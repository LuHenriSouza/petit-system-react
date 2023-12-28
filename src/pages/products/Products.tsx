import { Box, Button, Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, useMediaQuery, useTheme } from '@mui/material';
import { LayoutMain } from '../../shared/layouts';

// ICONS
import AddIcon from '@mui/icons-material/Add';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { IProduct, ProductService } from '../../shared/services/api';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';

export const Products: React.FC = () => {
    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))
    const { debounce } = useDebounce();
    const [searchParams, setSearchParams] = useSearchParams();

    const [rows, setRows] = useState<IProduct[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const search = useMemo(() => {
        return searchParams.get('search') || ''
    }, [searchParams])

    const page = useMemo(() => {
        return searchParams.get('page') || 1;
    }, [searchParams]);
    useEffect(() => {
        debounce(() => {

            setIsLoading(true);
            ProductService.getAll(Number(page), search)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        console.log(result);

                        setTotalCount(result.totalCount);
                        setRows(result.data);
                    }
                });
        });
    }, [search, page, debounce]);


    return (
        <LayoutMain title="Produtos" subTitle='Cadastre, edite e remova produtos'>
            <Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }}>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <TextField
                        size="small"
                        placeholder={'Pesquisar'}
                        value={search}
                        onChange={(event) => { setSearchParams({ search: event.target.value }, { replace: true }) }}
                    />
                    {(!smDown && <Button variant="contained"><AddIcon sx={{ mr: 1 }} />Novo Produto</Button>)}
                    {(smDown && <Button variant="contained"><AddIcon /></Button>)}
                </Box>
            </Paper>

            <Paper component={Paper} variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {(!smDown && <TableCell width={160}>Código</TableCell>)}
                            <TableCell>Nome</TableCell>
                            {(!smDown && <TableCell>Setor</TableCell>)}
                            <TableCell>Preço</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.id}>

                                {(!smDown && <TableCell>{row.code}</TableCell>)}
                                <TableCell>{row.name}</TableCell>
                                {(!smDown && <TableCell>{row.sector}</TableCell>)}
                                <TableCell>{row.price}</TableCell>
                                <TableCell>
                                    <IconButton size="small">
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton size="small">
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    {totalCount === 0 && (
                        <caption>{Environment.LISTAGEM_VAZIA}</caption>
                    )}

                    <TableFooter>
                        {(isLoading &&
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <LinearProgress variant='indeterminate' />
                                </TableCell>
                            </TableRow>
                        )}
                        {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Pagination
                                        page={Number(page)}
                                        count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                                        onChange={(_, newPage) => setSearchParams({ search, page: newPage.toString() }, { replace: true })}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </Paper>
        </LayoutMain>
    );
};