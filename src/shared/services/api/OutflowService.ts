
import { Environment } from '../../environment';
import { Api } from './axios-config';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}


export interface ICashOutflow {
    id: number,
    type: string,
    fincash_id: number,
    value: number,
    desc?: string | null,
    supplier_id?: number | null,
    created_at: Date,
    updated_at: Date,
    deleted_at?: Date,
}

type TProductTotalCount = {
    data: ICashOutflow[];
    totalCount: number;
}

const create = async (dados: Omit<ICashOutflow, 'id' | 'created_at' | 'updated_at'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<ICashOutflow>('/cashoutflow', dados, Autorization());

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const getAllById = async (page = 1, id: number): Promise<TProductTotalCount | Error> => {
    try {
        const urlRelativa = `/cashoutflow/all/${id}?page=${page}&limit=6`;
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


const getById = async (id: number): Promise<ICashOutflow | Error> => {
    try {
        const { data } = await Api.get(`/cashoutflow/${id}`, Autorization());

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
};

const updateDescById = async (id: number, dados: Omit<ICashOutflow, 'id' | 'created_at' | 'updated_at' | 'type' | 'fincash_id' | 'value'> ): Promise<void | Error> => {
    try {
        await Api.put(`/cashoutflow/${id}`, dados, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

// const deleteById = async (id: number): Promise<void | Error> => {
//     try {
//         await Api.delete(`/product/${id}`, Autorization());
//     } catch (error) {
//         console.error(error);
//         return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
//     }
// };


export const OutflowService = {
    create,
    getById,
    getAllById,
    updateDescById,
    // deleteById,
};
