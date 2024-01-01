import { Alert, Box, Button, Fab, Icon, Pagination, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LayoutMain } from '../../shared/layouts';
import Swal from 'sweetalert2'
import './../../shared/css/sweetAlert.css'
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IProduct, ProductService } from '../../shared/services/api';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web'
import { VTextField } from '../../shared/forms/VTextField';
import { VSelect, IMenuItens } from '../../shared/forms/VSelect';
import * as yup from 'yup';

const selectManuItens: IMenuItens[] = [
    { text: '1 - Bebidas', value: '1' },
    { text: '2 - Chocolates', value: '2' },
    { text: '3 - Salgadinhos', value: '3' },
    { text: '4 - Sorvetes', value: '4' }
];

interface IFormDataValidated {
    id: number
    name: string;
    sector: number;
    price: number;
}

interface IFormData {
    id: string
    name: string;
    sector: number;
    price: string;
}


const formValidation: yup.Schema<IFormDataValidated> = yup.object().shape({
    id: yup.number().required().integer(),
    name: yup.string().required().min(3).max(50),
    sector: yup.number().required().min(1).max(4),
    price: yup.number().required().min(0),
});


export const Products: React.FC = () => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const { debounce } = useDebounce();
    const [searchParams, setSearchParams] = useSearchParams();

    const [rows, setRows] = useState<IProduct[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isEdit, setIsEdit] = useState(0);
    const [querryError, setQuerryError] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);

    const formRef = useRef<FormHandles>(null);


    const search = useMemo(() => {
        return searchParams.get('search') || ''
    }, [searchParams])

    const page = useMemo(() => {
        return searchParams.get('page') || 1;
    }, [searchParams]);
    useEffect(() => {
        debounce(() => {
            listProducts();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, page, debounce]);


    const listProducts = () => {
        // setIsLoading(true);
        ProductService.getAll(Number(page), search)
            .then((result) => {
                // setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    console.log(result);

                    setTotalCount(result.totalCount);
                    setRows(result.data);
                }
            });
    }

    const handleDelete = (id: number, name: string) => {
        Swal.fire({
            title: 'Tem Certeza?',
            text: `Apagar "${name}" ?`,
            icon: 'warning',
            iconColor: theme.palette.error.main,
            showCancelButton: true,
            confirmButtonColor: theme.palette.error.main,
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Deletar'
        }).then((result) => {
            if (result.isConfirmed) {
                ProductService.deleteById(id).then((result) => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        Swal.fire({
                            title: 'Deletado!',
                            text: 'Produto apagado.',
                            icon: 'success',
                        });
                        listProducts();
                    }
                });

            }
        });
    };

    const handleEditMode = (id: number) => {
        setIsEdit(id)
    }

    const handleSubmit = async (data: IFormData) => {
        try {
            const getNumbers = data.price.split(' ');
            data.price = getNumbers[1];
            const dataValidated = await formValidation.validate(data, { abortEarly: false })
            const result = await ProductService.updateById(Number(data.id), dataValidated);

            if (result instanceof Error) {
                setQuerryError(true);
            } else {
                setQuerryError(false);
                setIsEdit(0);
                listProducts();
                Swal.fire({
                    icon: "success",
                    title: "Produto editado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (errors) {
            if (errors instanceof yup.ValidationError) {
                const validatenErrors: { [key: string]: string } = {};
                errors.inner.forEach((e) => {
                    if (!e.path) return;
                    validatenErrors[e.path] = e.message;
                });

                formRef.current?.setErrors(validatenErrors)
                return;
            }
            setQuerryError(true);
        }
    }

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
                    <Link to={'/produtos/novo'}>
                        {(!smDown && <Button variant="contained"><AddIcon sx={{ mr: 1 }} />Novo Produto</Button>)}
                        {(smDown && <Button variant="contained" sx={{ ml: 2 }}><AddIcon /></Button>)}
                    </Link>
                </Box>
            </Paper>

            <Paper component={Paper} variant="outlined" sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1, mt: 1, width: 'auto' }}>
                {(querryError && <Alert severity="error">Já existe um produto com este código !</Alert>)}
                <Form
                    onSubmit={handleSubmit}
                    placeholder={''}
                    ref={formRef}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                {(!smDown && <TableCell width={160}>Código</TableCell>)}
                                <TableCell width={406}>Nome</TableCell>
                                {(!smDown && <TableCell width={305}>Setor</TableCell>)}
                                <TableCell width={340}>Preço</TableCell>
                                <TableCell width={232}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                isEdit !== row.id ?
                                    <TableRow key={row.id} hover>

                                        {(!smDown && <TableCell>{row.code}</TableCell>)}
                                        <TableCell>{row.name}</TableCell>
                                        {(!smDown && <TableCell>{row.sector}</TableCell>)}
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>
                                            {(!isEdit &&
                                                <Fab size="medium" color="error" aria-label="add" sx={{ mr: 2, ...(smDown && { mb: 1 }) }} onClick={() => handleDelete(row.id, row.name)}>
                                                    <Icon>delete</Icon>
                                                </Fab>
                                            )}
                                            {(smDown &&
                                                <Link to={'/produtos/edit/' + row.id}>
                                                    <Fab size="medium" color="warning" aria-label="add" onClick={() => handleEditMode(row.id)}>
                                                        <Icon>edit</Icon>
                                                    </Fab>
                                                </Link>
                                            )}
                                            {(!smDown &&
                                                <Fab size="medium" color="warning" aria-label="add" onClick={() => handleEditMode(row.id)}>
                                                    <Icon>edit</Icon>
                                                </Fab>
                                            )}

                                        </TableCell>
                                    </TableRow >
                                    :
                                    <TableRow key={row.id} hover>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell>
                                            <Box maxWidth={330}>
                                                <VTextField name='id' valueDefault={`${row.id}`} sx={{ display: 'none' }} />
                                                <VTextField name='name' label={'Nome'} autoComplete="off" valueDefault={row.name} />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <VSelect name='sector' label='Setor' menuItens={selectManuItens} defaultSelected={row.sector} />
                                        </TableCell>
                                        <TableCell>
                                            <Box width={180}>
                                                <VTextField
                                                    name='price'
                                                    label={'Preço'}
                                                    autoComplete="off"
                                                    valueDefault={`R$ ${row.price}`}
                                                    cash
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Fab size="medium" color="error" aria-label="add" sx={{ mr: 2 }} onClick={() => setIsEdit(0)}>
                                                <Icon>close</Icon>
                                            </Fab>
                                            <Fab size="medium" color="success" aria-label="add" onClick={() => formRef.current?.submitForm()}>
                                                <Icon>check</Icon>
                                            </Fab>
                                        </TableCell>
                                    </TableRow >
                            ))}
                        </TableBody>

                        {totalCount === 0 && (
                            <caption>{Environment.LISTAGEM_VAZIA}</caption>
                        )}

                        <TableFooter>
                            {/* {(isLoading && !isLoading &&
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <LinearProgress variant='indeterminate' />
                                    </TableCell>
                                    </TableRow>
                                )} */}
                            {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Pagination
                                            page={Number(page)}
                                            count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                                            onChange={(_, newPage) => setSearchParams({ search, page: newPage.toString() }, { replace: true })}
                                            siblingCount={smDown ? 0 : 1}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableFooter>
                    </Table>
                </Form>
            </Paper>
        </LayoutMain >
    );
};