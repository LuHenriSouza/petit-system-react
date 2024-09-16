import { Environment } from '../../environment';
import { Api } from './axios-config';

const Autorization = () => {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
        }
    }
}
export interface IPayment {
    id: number,
    supplier_id: number,
    code: string,
    expiration: Date,
    value: number,
    desc?: string,
    created_at: Date,
    updated_at: Date,
}

export interface IPaymentResponse extends IPayment {
    name: string,
}

interface IPaymentTotalCount {
    data: IPaymentResponse[],
    totalCount: number,
}

const getAll = async (page = 1, limit = Environment.LIMITE_DE_LINHAS): Promise<IPaymentTotalCount | Error> => {
    try {
        const urlRelativa = `/payment?page=${page}&limit=${limit}`;
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


const create = async (dados: { code: string, supplier_id: number, desc?: string }): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IPayment>('/payment', dados, Autorization());

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const deleteById = async (id: number) => {
    try {
        await Api.delete(`/payment/${id}`, Autorization());
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
}

export const PaymentService = {
    getAll,
    create,
    deleteById,
};