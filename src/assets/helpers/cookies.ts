import { AUTH_RAW_TOKEN, AUTH_TOKEN } from '@assets/configs';
import { MenuItemType } from '@assets/types/menu';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';

const get = <T>(key: string): T | undefined => {
    const value = getCookie(key);

    if (!value) {
        return undefined;
    }

    try {
        return JSON.parse(value) as T;
    } catch (e) {
        return JSON.parse(JSON.stringify(value));
    }
};

const set = (key: string, value: any, options?: OptionsType) => {
    if (typeof value === 'string') {
        setCookie(key, value, options);
    } else {
        setCookie(key, JSON.stringify(value), options);
    }
};

const remove = (key: string) => {
    deleteCookie(key);
};

const logOut = () => {
    remove(AUTH_RAW_TOKEN);
    remove(AUTH_TOKEN);
};

const checkPermission = (permission: string, permissions: string[]): boolean => {
    if (!permissions || !permissions.includes(permission)) {
        return false;
    }

    return true;
};

const checkChildPermission = (item: MenuItemType, permissions: string[]): boolean => {
    if (item.items && item.items.length > 0) {
        return item.items.some((t) => permissions?.includes(t.permission || '') || typeof t.permission === 'undefined');
    }

    return false;
};

export { checkChildPermission, checkPermission, get, logOut, remove, set };
