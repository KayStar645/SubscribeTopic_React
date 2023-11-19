import { ACTION, AUTH_TOKEN } from '@assets/configs';
import { cookies } from '@assets/helpers';
import { AuthType } from '@assets/interface/Auth';
import { useEffect, useState } from 'react';

interface PermissionType {
    view: boolean;
    update: boolean;
    create: boolean;
    change: boolean;
    remove: boolean;
}

const initialState: PermissionType = {
    view: false,
    update: false,
    create: false,
    change: false,
    remove: false,
};

const usePermission = (module: string): PermissionType => {
    const [permission, setPermission] = useState<PermissionType>(initialState);

    useEffect(() => {
        const auth = cookies.get<AuthType>(AUTH_TOKEN);
        const modulePermission = auth?.permission.filter((t) => t.startsWith(module));
        const result = initialState;

        modulePermission?.forEach((t) => {
            if (t.endsWith(ACTION.view)) {
                result.view = true;
            }

            if (t.endsWith(ACTION.change)) {
                result.change = true;
            }

            if (t.endsWith(ACTION.update)) {
                result.update = true;
            }

            if (t.endsWith(ACTION.create)) {
                result.create = true;
            }

            if (t.endsWith(ACTION.remove)) {
                result.remove = true;
            }
        });

        setPermission(result);
    }, [module]);

    return permission;
};

export default usePermission;
