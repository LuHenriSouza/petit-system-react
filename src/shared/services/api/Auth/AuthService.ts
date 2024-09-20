import { Api } from "../axios-config";

interface IResponse {
    accessToken: string
}

const login = async (email: string, password: string): Promise<IResponse | Error> => {
    try {
        const user = { email: email, password: password }
        const { data } = await Api.post<IResponse>('/login', user)
        if (data) return data;
        return Error('Erro ao logar.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao logar.');
    }
}

const getRole = async (): Promise<string> => {
    try {
        const { data } = await Api.get('/role/get')
        return data.role;
    } catch (e) {
        console.error(e);
        return 'ERROR';
    }
}

export const AuthService = {
    login,
    getRole,
}   