import { Api } from "../axios-config";

interface IResponse {
    accessToken: string
}

const login = async (email: string, password: string): Promise<IResponse | Error> => {
    try {
        const user = { email: email, password: password }
        const { data } = await Api.post<IResponse>('/login', user)
        console.log('authService.ts/login: ' + data.accessToken);
        if (data) return data;
        return Error('Erro ao logar.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao logar.');
    }
}

export const AuthService = {
    login,

}   