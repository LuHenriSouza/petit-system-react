import { IProduct } from '.';
import { Environment } from '../../environment';
import { Api } from './axios-config';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}

export interface IProductWithStock extends IProduct {
    stock: number;
    prod_id: number;
}

type TStockTotalCount = {
    data: IProductWithStock[];
    totalCount: number;
}

const getAll = async (page = 1, limit = Environment.LIMITE_DE_LINHAS, filter = '', orderBy = 'updated_at'): Promise<TStockTotalCount | Error> => {
    try {
        const urlRelativa = `/stock?page=${page}&limit=${limit}&filter=${filter}&orderBy=${orderBy}`;
        const { data, headers } = await Api.get(urlRelativa, Autorization());
        if (data) {
            return {
                data,
                totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
            };
        }

        return new Error('Erro ao listar os registros.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
};

const create = async (prod_id: number, stock: number): Promise<number | Error> => {
    try {
        const {data} = await Api.post('/stock', { prod_id, stock }, Autorization());
        if (data) {
            return data.id;
        }

        return new Error('Erro ao cadastrar os registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao cadastrar os registro.');
    }
};

const updateById = async (stock_id: number, stock: number): Promise<number | Error> => {
    try {
        return await Api.put('/stock/'+stock_id, { stock }, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao editar o registro.');
    }
};

export const StockService = {
    getAll,
    create,
    updateById,
};