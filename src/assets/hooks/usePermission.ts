import { ACTION, AUTH_TOKEN } from '@assets/configs';
import { cookies } from '@assets/helpers';
import { AuthType } from '@assets/interface/Auth';
import { useEffect, useMemo, useState } from 'react';
import useCookies from './useCookies';

interface PermissionType {
    view: boolean;
    update: boolean;
    create: boolean;
    change: boolean;
    remove: boolean;
    assign: boolean;
}

const usePermission = (module: string): PermissionType => {
    let permission = {
        view: false,
        update: false,
        create: false,
        change: false,
        remove: false,
        assign: false,
    };
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);
    const modulePermission = auth?.permission.filter((t) => t.startsWith(module));

    modulePermission?.forEach((t) => {
        if (t.endsWith(ACTION.view)) {
            permission.view = true;
        }

        if (t.endsWith(ACTION.change)) {
            permission.change = true;
        }

        if (t.endsWith(ACTION.update)) {
            permission.update = true;
        }

        if (t.endsWith(ACTION.create)) {
            permission.create = true;
        }

        if (t.endsWith(ACTION.remove)) {
            permission.remove = true;
        }

        if (t.endsWith(ACTION.assign)) {
            permission.assign = true;
        }
    });

    return permission;
};

export default usePermission;
