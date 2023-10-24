import { getCookie } from 'cookies-next';

const get = (key: string) => {
    const value = getCookie(key);

    if (!value) {
        return undefined;
    }

    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};

export { get };
