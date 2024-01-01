// import { Environment } from '../../../environment';
import { Api } from '../axios-config';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}

export interface ISale {
    id: number;
    prod_id: number;
    quantity: number;
    price: number;
}

// type TSaleTotalCount = {
//     data: ISale[];
//     totalCount: number;
// }

const create = async (dados: Omit<ISale, 'id'>[]): Promise<number | Error> => {
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

// const getAll = async (page = 1, filter = ''): Promise<TSaleTotalCount | Error> => {
//     try {
//         const urlRelativa = `/product?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;
//         const { data, headers } = await Api.get(urlRelativa, Autorization());
//         if (data) {
//             return {
//                 data,
//                 totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
//             };
//         }

//         return new Error('Erro ao listar os registros.');
//     } catch (error) {
//         console.error(error);
//         return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
//     }
// };



// const getAllById = async (id: number): Promise<IProduct | Error> => {
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

export const SaleService = {
    create,
    // getAll,
    // getAllById,
};