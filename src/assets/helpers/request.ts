import { ROUTES, TOKEN } from '@assets/configs';
import { MetaType, ParamType } from '@assets/types/request';
import axios, { AxiosRequestConfig } from 'axios';
import { getCookie } from 'cookies-next';
import queryString from 'query-string';

const request = axios.create({
	baseURL: ROUTES.base,
	headers: {
		accept: 'text/plain',
		'Content-Type': 'application/json',
	},
});

request.interceptors.request.use(
	(config) => {
		if (!config.headers.Authorization) {
			const token = getCookie(TOKEN);

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

const get = (path: string, params?: ParamType, configs?: AxiosRequestConfig) => {
	const fullPath = params ? `${path}?${queryString.stringify(params)}` : path;
	const response = request.get(fullPath, configs);

	return response;
};

const post = (path: string, data: any, configs?: AxiosRequestConfig) => {
	const response = request.post(path, data, configs);

	return response;
};

const update = (path: string, data: any, configs?: AxiosRequestConfig) => {
	const response = request.put(path, data, configs);

	return response;
};

const remove = (path: string, configs?: AxiosRequestConfig) => {
	const response = request.delete(path, configs);

	return response;
};

const defaultMeta: MetaType = {
	currentPage: 1,
	hasNextPage: false,
	hasPreviousPage: false,
	messages: null,
	pageSize: 10,
	totalCount: 1,
	totalPages: 1,
};

export { get, post, remove, update, defaultMeta };
