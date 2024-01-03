import { Environment } from '../../environment';
import { Api } from './axios-config';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}

export interface ISupplier {
    id: number,
    name: string,

}

type TProductTotalCount = {
    data: ISupplier[];
    totalCount: number;
}

const getAll = async (page = 1, filter = '', limit?: number): Promise<TProductTotalCount | Error> => {
    try {
        const urlRelativa = `/supplier?page=${page}&limit=${limit ? limit : Environment.LIMITE_DE_LINHAS}&filter=${filter}`;
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


const create = async (dados: Omit<ISupplier, 'id' | 'created_at' | 'updated_at'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<ISupplier>('/supplier', dados, Autorization());

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: Omit<ISupplier, 'id'>): Promise<void | Error> => {
    try {
        await Api.put(`/supplier/${id}`, dados, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/supplier/${id}`, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
};

const getById = async (id: number): Promise<ISupplier | Error> => {
    try {
        const { data } = await Api.get(`/supplier/${id}`, Autorization());

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
};

export const SupplierService = {
    getAll,
    create,
    getById,
    deleteById,
    updateById,
};