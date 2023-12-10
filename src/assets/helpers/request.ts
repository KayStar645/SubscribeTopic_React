import { AUTH_RAW_TOKEN, AUTH_TOKEN, ROUTES } from '@assets/configs';
import { AuthType } from '@assets/interface/Auth';
import { OptionType } from '@assets/types/common';
import { MetaType, ParamType, ResponseType } from '@assets/types/request';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import _ from 'lodash';
import { cookies } from '.';

const request = axios.create({
    baseURL: ROUTES.base,
    // timeout: 5000,
    headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
    },
});

request.interceptors.request.use(
    (config) => {
        while (true) {
            const token = cookies.get(AUTH_RAW_TOKEN);
            const auth = cookies.get<AuthType>(AUTH_TOKEN);

            if (!config.headers.Authorization) {
                config.headers.Authorization = '';
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (!auth) {
                break;
            }

            if (!config.data && (config.method === 'put' || config.method === 'post' || config.method === 'delete')) {
                config.data = {};
            }

            if (!config.params && config.method === 'get') {
                config.params = {};
            }

            if (config.params && config.params.removeFacultyId) {
                delete config.params.removeFacultyId;

                break;
            }

            if (config.method === 'get') {
                config.params.facultyId = auth?.faculty?.Id;
            }

            if (config.method === 'put' || config.method === 'post' || config.method === 'delete') {
                config.data.facultyId = auth?.faculty.Id;
            }

            break;
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
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

const get = <T = any>(path: string, configs?: AxiosRequestConfig): Promise<AxiosResponse<ResponseType<T>, any>> => {
    const response = request.get(path, configs);

    return response;
};

const post = <T = any>(
    path: string,
    data: any,
    configs?: AxiosRequestConfig,
): Promise<AxiosResponse<ResponseType<T>, any>> => {
    const response = request.post(path, data, configs);

    return response;
};

const update = <T = any>(
    path: string,
    data: any,
    configs?: AxiosRequestConfig,
): Promise<AxiosResponse<ResponseType<T>, any>> => {
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
    messages: [],
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

const handleFilter = (
    original: string | undefined,
    field: string,
    operator: '>' | '@=' | '==',
    value: string | number | undefined,
) => {
    let filters = original?.split(', ') || [];

    filters = filters.filter((t) => t != '');
    let index = filters.findIndex((t) => t.includes(field + operator));

    if (filters.length > 0 && index > -1) {
        filters.splice(index, 1);
    }

    if (value) {
        filters.push(field + operator + value);
    }

    return filters.join(', ') || '';
};

const currentPage = (page: number | undefined) => {
    return page ? page - 1 : 0;
};

export { currentPage, defaultMeta, get, handleFilter, handleSort, post, remove, update };
