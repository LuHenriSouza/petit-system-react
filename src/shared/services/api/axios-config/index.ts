import { Environment } from '../../../environment';
import axios from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';

const Api = axios.create({
    baseURL: Environment.URL_BASE,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('APP_ACCESS_TOKEN')}`
    }
});
console.log('axios/index: '+ localStorage.getItem('APP_ACCESS_TOKEN'));
Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);


export { Api }