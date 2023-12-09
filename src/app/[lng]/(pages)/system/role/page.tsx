'use client';

import { API, MODULE } from '@assets/configs';
import { request } from '@assets/helpers';
import usePermission from '@assets/hooks/usePermission';
import { RoleType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import { ResponseType } from '@assets/types/request';
import { Loader } from '@resources/components/UI';
import { ConfirmModal } from '@resources/components/modal';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import RoleFormType, { RoleFormRefType } from './form';

const RolePage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const formRef = useRef<RoleFormRefType>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [selected, setSelected] = useState<RoleType>();
    const permission = usePermission(MODULE.role);

    const roleQuery = useQuery<RoleType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['roles', 'list'],
        queryFn: async () => {
            const response = await request.get<RoleType[]>(`${API.admin.role}`);

            return response.data.data || [];
        },
    });

    const roleMutation = useMutation<any, AxiosError<ResponseType>, RoleType>({
        mutationFn: (data) => {
            return request.remove(`${API.admin.role}`, { params: { id: data.id } });
        },
    });

    const renderActions = (data: RoleType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                {permission.update && (
                    <i
                        className='pi pi-pencil hover:text-primary cursor-pointer'
                        onClick={() => {
                            formRef.current?.show?.(data);
                            setSelected(data);
                        }}
                    />
                )}
                {permission.remove && (
                    <i
                        className='pi pi-trash hover:text-red-600 cursor-pointer'
                        onClick={(e) => {
                            confirmModalRef.current?.show?.(e, data, t('sure_to_delete', { obj: data.name }));
                        }}
                    />
                )}
            </div>
        );
    };

    const onRemove = (data: RoleType) => {
        roleMutation.mutate(data, {
            onSuccess: () => {
                roleQuery.refetch();
                toast.success(t('request:update_success'));
            },
            onError: (err) => {
                toast.error(err.response?.data.messages?.[0] || err.message);
            },
        });
    };

    return (
        <div className='flex flex-column gap-4'>
            <ConfirmModal
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={t('confirm')}
                rejectLabel={t('cancel')}
            />

            <div className='flex align-items-center justify-content-between bg-white h-4rem px-3 border-round-lg shadow-3'>
                <p className='text-xl font-semibold'>{t('list_of', { module: t('module:role').toLowerCase() })}</p>

                <Button
                    label={t('create_new')}
                    icon='pi pi-plus'
                    size='small'
                    visible={permission.create}
                    onClick={() => {
                        formRef.current?.show?.();
                        setSelected(undefined);
                    }}
                />
            </div>

            <div className='flex align-items-center justify-content-between'>
                <InputText placeholder={`${t('search')}...`} className='w-20rem' />
            </div>

            <div className='border-round-xl overflow-hidden relative shadow-5 w-30rem'>
                <Loader show={roleQuery.isFetching || roleMutation.isPending} />

                <DataTable
                    value={roleQuery.data}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={t('list_empty')}
                >
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                        }}
                        header={t('common:action')}
                        body={renderActions}
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='name'
                        header={t('common:name_of', { obj: t('module:role').toLowerCase() })}
                    />
                </DataTable>
            </div>

            <RoleFormType
                lng={lng}
                title={
                    selected?.id
                        ? t('update_at', { obj: selected.name })
                        : t('create_new_at', { obj: t('module:role').toLowerCase() })
                }
                ref={formRef}
                onSuccess={(_data) => roleQuery.refetch()}
            />
        </div>
    );
};

export default RolePage;
