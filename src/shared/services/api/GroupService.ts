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

export interface IGroup {
    id: number,
    name: string,
    show: boolean,
}

export interface IProduct_group {
    id: number,
    prod_id: number,
    group_id: number,
}

type TGroupTotalCount = {
    data: IGroup[];
    totalCount: number;
}

type TProdGroupTotalCount = {
    data: IProduct[];
    show: boolean;
    totalCount: number;
}

const getAll = async (page = 1, filter = '', limit = Environment.LIMITE_DE_LINHAS): Promise<TGroupTotalCount | Error> => {
    try {
        const urlRelativa = `/group?page=${page}&limit=${limit}&filter=${filter}`;
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

const getProdsByGroup = async (id: number, page = 1, filter = '', limit = Environment.LIMITE_DE_LINHAS): Promise<TProdGroupTotalCount | Error> => {
    try {
        const urlRelativa = `/group/product/${id}?page=${page}&limit=${limit}&filter=${filter}`;
        const { data, headers } = await Api.get(urlRelativa, Autorization());
        if (data) {
            return {
                data: data.data,
                show: data.show,
                totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
            };
        }

        return new Error('Erro ao listar os registros.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
};

const create = async (dados: Omit<IGroup, 'id' | 'show'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IGroup>('/group', dados, Autorization());

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const putProdInGroup = async (group_id: number, prod_id: number): Promise<number | Error> => {
    try {
        const { data } = await Api.post(`/group/product/${group_id}`, { prod_id: prod_id }, Autorization());
        if (data) {
            return data.id;
        }
        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const removeProdFromGroup = async (group_id: number, prod_id: number) => {
    try {
        await Api.post(`/group/product/remove/${group_id}`, { prod_id }, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
}


const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/group/${id}`, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
};

const updateShow = async (group_id: number, show: boolean): Promise<void | Error> => {
    try {
        await Api.put(`/group/show/${group_id}`, { show }, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const getShowGroups = async (): Promise<IGroup[] | Error> => {
    try {
        const { data } = await Api.get('/group/show', Autorization());
        if (data) {
            return data;
        }

        return new Error('Erro ao listar os registros.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
}

// const getById = async (id: number): Promise<IProduct | Error> => {
//     try {
//         const { data } = await Api.get(`/product/${id}`, Autorization());

//         if (data) {
//             return data;
//         }

//         return new Error('Erro ao consultar o registro.');
//     } catch (error) {
//         console.error(error);
//         return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
//     }
// };

export const GroupService = {
    getAll,
    create,
    deleteById,
    updateShow,
    getShowGroups,
    putProdInGroup,
    getProdsByGroup,
    removeProdFromGroup,
};