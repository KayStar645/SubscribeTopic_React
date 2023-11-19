import { cookies } from '@assets/helpers';
import { OptionsType } from 'cookies-next/lib/types';
import { useEffect, useState } from 'react';

const useCookies = <T>(key: string): [T | undefined, (_key: string, _value: T, _options?: OptionsType) => void] => {
    const [data, _setData] = useState<T>();

    useEffect(() => {
        const value = cookies.get<T>(key);

        _setData(value);
    }, [key]);

    const setData = (key: string, value: T, options?: OptionsType) => {
        cookies.set(key, value, options);

        _setData(value);
    };

    return [data, setData];
};

export default useCookies;
