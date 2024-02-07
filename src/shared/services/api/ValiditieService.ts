import { Api } from './axios-config';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}

// const getAll = async (page = 1, limit = Environment.LIMITE_DE_LINHAS, filter = ''): Promise<TStockTotalCount | Error> => {
//     try {
//         const urlRelativa = `/stock?page=${page}&limit=${limit}&filter=${filter}`;
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

export const ValiditieService = {
    // getAll,
    create,
};