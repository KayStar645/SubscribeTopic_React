import { ROUTES, AUTH_TOKEN } from '@assets/configs';
import { OptionType } from '@assets/types/common';
import { MetaType, ParamType } from '@assets/types/request';
import axios, { AxiosRequestConfig } from 'axios';
import { getCookie } from 'cookies-next';
import _ from 'lodash';
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
			const token = getCookie(AUTH_TOKEN);

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

request.interceptors.response.use(
	(response) => {
		return response;
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

const handleSort = (sorts: OptionType | undefined, params: ParamType): string => {
	let result = params.sorts || '';

	if (!sorts) {
		return result;
	}

	const resultSplit = _.split(result, ',').filter((t) => t !== '');

	const keyIndex = resultSplit.findIndex((t) => t.includes(sorts.name || '...'));
	const symbol = sorts.value === 1 ? '' : '-';
	const newValue = `${symbol}${sorts.name}`;

	if (keyIndex !== -1) {
		resultSplit[keyIndex] = newValue;
	} else {
		resultSplit.push(newValue);
	}

	result = _.join(resultSplit, ',');

	return result;
};

export { get, post, remove, update, defaultMeta, handleSort };
