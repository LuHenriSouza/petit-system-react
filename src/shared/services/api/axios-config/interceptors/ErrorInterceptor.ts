import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError) => {
    if (error.message === 'Network Error') {
        return Promise.reject(new Error('Sem conexão.'))
    }

    if (error.response?.status === 401) {
        return Promise.reject(new Error('Server error.'))
    }

    return Promise.reject(error);
};