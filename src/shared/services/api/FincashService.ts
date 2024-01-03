// import { Environment } from '../../environment';
import { Api } from './axios-config';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}

export interface IFincash {
    id: number,
    opener: string
    value: number,
    isFinished: boolean,
    finalValue?: number | null,
    finalDate?: Date | null,
    created_at: Date,
    updated_at: Date,
    deleted_at?: Date,
    
}

// type TProductTotalCount = {
    //     data: IFincash[];
    //     totalCount: number;
    // }
    
    
    const create = async (dados: Omit<IFincash, 'id' | 'created_at' | 'updated_at' | 'isFinished'>): Promise<number | Error> => {
        try {
            const { data } = await Api.post<IFincash>('/fincash', dados, Autorization());
            
            if (data) {
                return data.id;
            }
            
            return new Error('Erro ao criar o registro.');
        } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const getById = async (id: number): Promise<IFincash | Error> => {
    try {
        const { data } = await Api.get(`/fincash/${id}`, Autorization());

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
};

const getOpenFincash = async (): Promise<IFincash | Error> => {
    try {
        const { data } = await Api.get<IFincash>('/fincash/verify', Autorization());
        
        if (data) {
            return data;
        }
        
        return new Error('Erro ao achar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao achar o registro.');
    }
};


// const getAll = async (page = 1, filter = ''): Promise<TProductTotalCount | Error> => {
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


// const updateById = async (id: number, dados: Omit<IProduct, 'id' | 'created_at' | 'updated_at' | 'code'>): Promise<void | Error> => {
//     try {
//         await Api.put(`/product/${id}`, dados, Autorization());
//     } catch (error) {
//         console.error(error);
//         return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
//     }
// };

// const deleteById = async (id: number): Promise<void | Error> => {
//     try {
//         await Api.delete(`/product/${id}`, Autorization());
//     } catch (error) {
//         console.error(error);
//         return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
//     }
// };


export const FincashService = {
    create,
    getById,
    getOpenFincash,
    //     getAll,
    //     updateById,
    //     deleteById,
};