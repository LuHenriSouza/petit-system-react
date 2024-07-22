import { Environment } from '../../environment';
import { Api } from './axios-config';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}

export interface IGetSales {
    sale_id: number,
    obs: string,
    created_at: Date,
    totalValue: number,
}

export interface ISaleRaw {
    id: number,
    obs?: string,
    fincash_id: number,
    created_at: Date,
    updated_at: Date,

}

export interface ISale {
    id: number;
    prod_id: number;
    quantity: number;
    price: number;
}

export interface ISaleObs {
    data: Omit<ISale, "id">[],
    obs: string,
}

export interface ISaleDetail {
    id: number,
    sale_id: number,
    prod_id: number,
    quantity: number,
    price: number,
    pricetotal: number,
    created_at: Date,
    updated_at: Date,
    deleted_at?: Date,

}

type TSaleDetailTotalCount = {
    data: ISaleDetail[];
    totalValue: number;
    totalCount: number;
}

type TSaleTotalCount = {
    data: IGetSales[];
    totalCount: number;
}

const create = async (dados: ISaleObs): Promise<number | Error> => {
    try {
        const { data } = await Api.post<ISale>('/sale', dados, Autorization());

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const getAllById = async (id: number, page = 1): Promise<TSaleDetailTotalCount | Error> => {
    try {
        const { data, headers } = await Api.get(`/sale/all/${id}?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}`, Autorization());
        if (data) {
            return {
                data: data.data,
                totalValue: data.totalValue,
                totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
            };
        }

        return new Error('Erro ao listar os registros.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
};

const getSales = async (page = 1, filter = ''): Promise<TSaleTotalCount | Error> => {
    try {
        const urlRelativa = `/sale/all?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;
        const { data, headers } = await Api.get(urlRelativa, Autorization());
        if (data) {
            console.log(data)
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


const getById = async (id: number): Promise<ISaleRaw | Error> => {
    try {
        const { data } = await Api.get(`/sale/raw/${id}`, Autorization());

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
};

const createObs = async (id: number, data: Omit<ISaleRaw, 'id' | 'fincash_id' | 'created_at' | 'updated_at'>) => {
    try {
        await Api.put(`/sale/${id}`, data, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
};

const getSalesByFincash = async (fincash_id: number, page = 1, limit = Environment.LIMITE_DE_LINHAS): Promise<TSaleTotalCount | Error> => {
    try {
        const { data, headers } = await Api.get(`/sale/fincash/${fincash_id}?page=${page}&limit=${limit}`, Autorization());
        if (data) {
            console.log('test:')
            console.log(data)
            return {
                data: data,
                totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
            };
        }

        return new Error('Erro ao listar os registros.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
};

export const SaleService = {
    create,
    getById,
    getSales,
    createObs,
    getAllById,
    getSalesByFincash,
};