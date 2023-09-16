import { ROUTES } from '@assets/configs';
import axios, { AxiosRequestConfig } from 'axios';

const request = axios.create({
	baseURL: ROUTES.base,
	withCredentials: true,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

request.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		console.log(error);

		return Promise.reject(error);
	},
);

const get = async (route: string, configs: AxiosRequestConfig) => {
	const response = request.get(route, configs);

	return (await response).data;
};

export { get };
