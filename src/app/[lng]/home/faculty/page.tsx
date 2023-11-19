'use client';

import { API, MODULE, ROWS_PER_PAGE } from '@assets/configs';
import { request } from '@assets/helpers';
import { FacultyParamType, FacultyType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import { MetaType, ResponseType } from '@assets/types/request';
import { Dropdown } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import FacultyForm, { FacultyFormRefType } from './form';
import { Loader } from '@resources/components/UI';
import { ConfirmModal } from '@resources/components/modal';
import { AxiosError } from 'axios';
import { DATE_FILTER } from '@assets/configs/general';
import usePermission from '@assets/hooks/usePermission';

const FacultyPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const formRef = useRef<FacultyFormRefType>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const [selected, setSelected] = useState<FacultyType>();
    const permission = usePermission(MODULE.faculty);

    const [params, setParams] = useState<FacultyParamType>({
        page: meta.currentPage,
        pageSize: meta.pageSize,
        sorts: '-DateCreated',
    });

    const facultyQuery = useQuery<FacultyType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['faculties', 'list', params],
        queryFn: async () => {
            const response = await request.get<FacultyType[]>(`${API.admin.faculty}`, { params });

            setMeta({
                currentPage: response.data.extra?.currentPage,
                hasNextPage: response.data.extra?.hasNextPage,
                hasPreviousPage: response.data.extra?.hasPreviousPage,
                pageSize: response.data.extra?.pageSize,
                totalCount: response.data.extra?.totalCount,
                totalPages: response.data.extra?.totalPages,
                messages: response.data.extra?.messages,
            });

            return response.data.data || [];
        },
        onError: (err) => {
            toast.error(err.response?.data.messages?.[0] || err.message);
        },
    });

    const facultyMutation = useMutation<any, AxiosError<ResponseType>, FacultyType>({
        mutationFn: (data) => {
            return request.remove(`${API.admin.faculty}`, { params: { id: data.id } });
        },
    });

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setParams((prev) => ({ ...prev, pageSize: e.rows, currentPage: e.first + 1 }));
    };

    const renderActions = (data: FacultyType) => {
        return (
            <div className='flex align-items-center gap-3'>
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

    const onRemove = (data: FacultyType) => {
        facultyMutation.mutate(data, {
            onSuccess: () => {
                facultyQuery.refetch();
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
                <p className='text-xl font-semibold'>{t('list_of', { module: t('module:faculty').toLowerCase() })}</p>

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

            <div className='border-round-xl overflow-hidden relative shadow-5'>
                <Loader show={facultyQuery.isLoading || facultyMutation.isLoading} />

                <DataTable
                    value={facultyQuery.data}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={t('list_empty')}
                >
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                        }}
                        header={t('common:action')}
                        body={renderActions}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='internalCode'
                        header={t('common:code_of', { obj: t('module:faculty').toLowerCase() })}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='name'
                        header={t('common:name_of', { obj: t('module:faculty').toLowerCase() })}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='address'
                        header={t('address')}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='phoneNumber'
                        header={t('phone_number')}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='email'
                        header={t('email')}
                    />
                </DataTable>

                <div className='flex align-items-center justify-content-between bg-white px-3 py-2'>
                    <Dropdown
                        id='date_created_filter'
                        value='date_decrease'
                        optionValue='code'
                        onChange={(sortCode) => {
                            const filter = DATE_FILTER(t).find((t) => t.code === sortCode);

                            setParams((prev) => {
                                return {
                                    ...prev,
                                    sorts: request.handleSort(filter, prev),
                                };
                            });
                        }}
                        options={DATE_FILTER(t)}
                    />

                    <Paginator
                        first={request.currentPage(meta.currentPage)}
                        rows={meta.pageSize}
                        totalRecords={meta.totalCount}
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        onPageChange={onPageChange}
                        className='border-noround p-0'
                    />
                </div>
            </div>

            <FacultyForm
                lng={lng}
                title={
                    selected?.id
                        ? t('update_at', { obj: selected.name })
                        : t('create_new_at', { obj: t('module:faculty').toLowerCase() })
                }
                ref={formRef}
                onSuccess={(data) => facultyQuery.refetch()}
            />
        </div>
    );
};

export default FacultyPage;
