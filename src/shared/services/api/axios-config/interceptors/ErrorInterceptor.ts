import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError) => {
    if (error.message === 'Network Error') {
        return Promise.reject(new Error('Sem conexão.'))
    }

    if (error.response?.status === 401) {
        console.log('axios/errorInterceptor: ' + localStorage.getItem('APP_ACCESS_TOKEN'));
        localStorage.removeItem('APP_ACCESS_TOKEN')
        return Promise.reject(new Error('Não Autorizado.'));

    }

    return Promise.reject(error);
};