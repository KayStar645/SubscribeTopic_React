import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { snakeCase } from 'lodash';

interface PermissionType {
    name: string;
    actions: string[];
}

const useGetGroupPermission = () => {
    let groupPermissions: PermissionType[] = [];
    const permissionQuery = useQuery<string[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['groupPermissions', 'list'],
        queryFn: async () => {
            const response = await request.get<string[]>(API.admin.permission);

            return response.data.data || [];
        },
    });

    groupPermissions = (permissionQuery?.data || []).reduce<PermissionType[]>((acc, permission) => {
        const [name] = permission.split('.');
        const existingObject = acc.find((obj) => obj.name === snakeCase(name));

        if (existingObject) {
            existingObject.actions.push(permission);
        } else {
            acc.push({ name: snakeCase(name), actions: [permission] });
        }

        return acc;
    }, []);

    return groupPermissions;
};

export default useGetGroupPermission;
