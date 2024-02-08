import { IProduct } from '.';
import { Api } from './axios-config';
import { Environment } from '../../environment';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}

export interface IProductWithValidity extends IProduct {
    quantity: number,
    validity: Date,
    created_at: Date,
    updated_at: Date,
}

type TValidityTotalCount = {
    data: IProductWithValidity[],
    totalCount: number,
}

const getAllByProd = async (page = 1, limit = Environment.LIMITE_DE_LINHAS, prod_id: number) => {
    try {
        const urlRelativa = `/validity/${prod_id}?page=${page}&limit=${limit}`;
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
}

const getAll = async (page = 1, limit = Environment.LIMITE_DE_LINHAS): Promise<TValidityTotalCount | Error> => {
    try {
        const urlRelativa = `/validity/all?page=${page}&limit=${limit}`;
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

const create = async (prod_id: number, validity: Date, quantity: number): Promise<number | Error> => {
    try {
        const { data } = await Api.post('/validity', { prod_id, validity, quantity }, Autorization());
        if (data) {
            return data.id;
        }

        return new Error('Erro ao cadastrar os registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao cadastrar os registro.');
    }
};

export const ValidityService = {
    getAll,
    create,
    getAllByProd,
};