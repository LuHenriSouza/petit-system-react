import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError) => {
    if (error.message === 'Network Error') {
        return Promise.reject(new Error('Sem conexão.'))
    }

    if (error.response?.status === 401) {
        const data = error.response.data as { errors: { default: string } };
        if (data.errors.default == 'INVALID TOKEN') {
            localStorage.removeItem('APP_ACCESS_TOKEN');
            window.location.reload();
            return Promise.reject(new Error('Não Autorizado.'));
        }
    }

    return Promise.reject(error);
};