import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { RoleType } from '@assets/interface';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const useGetPermissionDetail = (id?: string | number) => {
    let permissions: string[] = [];

    const permissionDetailQuery = useQuery<RoleType, AxiosError<ResponseType>>({
        queryKey: ['permissionsDetail'],
        refetchOnWindowFocus: false,
        enabled: false,
        queryFn: async () => {
            const response = await request.get<RoleType>(`${API.admin.detail.role}?pId=${id}`);

            return response.data.data || {};
        },
    });

    permissions = permissionDetailQuery.data?.permissionsName || [];

    return permissions;
};

export default useGetPermissionDetail;
