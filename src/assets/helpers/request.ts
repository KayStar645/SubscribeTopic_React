import { AUTH_TOKEN, FACULTY_TOKEN, ROUTES } from '@assets/configs';
import { OptionType } from '@assets/types/common';
import { MetaType, ParamType, ResponseType } from '@assets/types/request';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import _ from 'lodash';
import { cookie } from '.';

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
            const token = cookie.get(AUTH_TOKEN);
            const faculty: any = cookie.get(FACULTY_TOKEN);

            if (!config.headers.Authorization) {
                config.headers.Authorization = '';
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (!faculty) {
                break;
            }

            if (!config.data && (config.method === 'put' || config.method === 'post' || config.method === 'delete')) {
                config.data = {};
            }

            if (!config.params && config.method === 'get') {
                config.params = {};
            }

            if (config.method === 'get') {
                config.params.facultyId = faculty?.Id;
            }

            if (config.method === 'put' || config.method === 'post' || config.method === 'delete') {
                config.data.facultyId = faculty?.Id;
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
    (error) => {
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

const currentPage = (page: number | undefined) => {
    return page ? page - 1 : 0;
};

export { defaultMeta, currentPage, get, handleSort, post, remove, update };
