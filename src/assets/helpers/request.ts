import { AUTH_TOKEN, FACULTY_TOKEN, ROUTES } from '@assets/configs';
import { FacultyType } from '@assets/interface';
import { OptionType } from '@assets/types/common';
import { MetaType, ParamType } from '@assets/types/request';
import axios, { AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import { cookie } from '.';

const request = axios.create({
    baseURL: ROUTES.base,
    timeout: 5000,
    headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
    },
});

request.interceptors.request.use(
    (config) => {
        while (true) {
            const token = cookie.get(AUTH_TOKEN);
            const faculty: FacultyType = cookie.get(FACULTY_TOKEN);

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
                config.params.facultyId = faculty?.id;
            }

            if (config.method === 'put' || config.method === 'post' || config.method === 'delete') {
                config.data.facultyId = faculty?.id;
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

const get = (path: string, configs?: AxiosRequestConfig) => {
    const response = request.get(path, configs);

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

export { defaultMeta, get, handleSort, post, remove, update };
