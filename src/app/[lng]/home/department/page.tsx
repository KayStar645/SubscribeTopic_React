'use client';

import { API, AUTH_TOKEN, FACULTY_TOKEN, ROWS_PER_PAGE } from '@assets/configs';
import { request } from '@assets/helpers';
import { DepartmentParamType, DepartmentType, FacultyType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import { MetaType } from '@assets/types/request';
import Loader from '@resources/components/UI/Loader';
import { Dropdown } from '@resources/components/form';
import ConfirmModal from '@resources/components/modal/ConfirmModal';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import DepartmentForm, { DepartmentFormRefType } from './(components)/form';
import { getCookie, hasCookie } from 'cookies-next';

const DepartmentPage = ({ params: { lng } }: PageProps) => {
    const faculty: FacultyType = hasCookie(AUTH_TOKEN) ? JSON.parse(getCookie(FACULTY_TOKEN)!) : {};
    const { t } = useTranslation(lng);
    const formRef = useRef<DepartmentFormRefType>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const toastRef = useRef<Toast>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const [params, setParams] = useState<DepartmentParamType>({
        page: meta.currentPage,
        pageSize: meta.pageSize,
        sorts: '-DateCreated',
        facultyId: faculty.id,
    });
    const [selected, setSelected] = useState<DepartmentType>();

    const queryClient = useQueryClient();
    const departmentQuery = useQuery<AxiosResponse, AxiosError<any, any>, DepartmentType[]>({
        queryKey: ['departments', 'list', params],
        queryFn: async () => {
            const response = await request.get(`${API.admin.department}`, { params });

            setMeta({
                currentPage: response.data.extra.currentPage,
                hasNextPage: response.data.extra.hasNextPage,
                hasPreviousPage: response.data.extra.hasPreviousPage,
                pageSize: response.data.extra.pageSize,
                totalCount: response.data.extra.totalCount,
                totalPages: response.data.extra.totalPages,
                messages: response.data.extra.messages,
            });

            return response.data.data || [];
        },
        onError: (error) => {
            toastRef.current?.show({
                severity: 'error',
                summary: t('notification'),
                detail: error?.response?.data?.message || error.message,
            });
        },
    });
    const departmentMutation = useMutation<AxiosResponse, AxiosError<any, any>, DepartmentType>({
        mutationFn: (data: DepartmentType) => {
            return request.remove(`${API.admin.department}`, { params: { id: data.id } });
        },
    });

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setParams((prev) => ({ ...prev, pageSize: e.rows, currentPage: e.first + 1 }));
    };

    const renderActions = (department: DepartmentType) => {
        return (
            <div className='flex align-items-center gap-3'>
                <i
                    className='pi pi-pencil hover:text-primary cursor-pointer'
                    onClick={() => {
                        formRef.current?.show?.(department);
                        setSelected(department);
                    }}
                ></i>
                <i
                    className='pi pi-trash hover:text-red-600 cursor-pointer'
                    onClick={(e) => {
                        confirmModalRef.current?.show?.(e, department, t('sure_to_delete', { obj: department.name }));
                    }}
                ></i>
            </div>
        );
    };

    const onRemoveDepartment = (department: DepartmentType) => {
        departmentMutation.mutate(department, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ['departments'] });
                toastRef.current?.show({
                    severity: 'success',
                    summary: t('notification'),
                    detail: t('request:update_success'),
                });
            },
            onError: (error) => {
                toastRef.current?.show({
                    severity: 'error',
                    summary: t('notification'),
                    detail: error?.response?.data?.message || error.message,
                });
            },
        });
    };

    return (
        <div className='flex flex-column gap-4'>
            <Toast ref={toastRef} />

            <ConfirmModal
                ref={confirmModalRef}
                onAccept={onRemoveDepartment}
                acceptLabel={t('confirm')}
                rejectLabel={t('cancel')}
            />

            <div className='flex align-items-center justify-content-between bg-white py-2 px-3 border-round-lg shadow-3'>
                <p className='text-xl font-semibold'>
                    {t('list_of', { module: t('module:department').toLowerCase() })}
                </p>
                <Button
                    label={t('create_new')}
                    icon='pi pi-plus'
                    size='small'
                    onClick={() => {
                        formRef.current?.show?.();
                        setSelected(undefined);
                    }}
                />
            </div>
            <div className='flex align-items-center justify-content-between'>
                <InputText placeholder={`${t('search')}...`} className='col-4' />
            </div>
            <div className='border-round-xl overflow-hidden relative shadow-5'>
                <Loader show={departmentQuery.isLoading || departmentMutation.isLoading} />

                <DataTable
                    value={departmentQuery.data || []}
                    rowHover={true}
                    stripedRows={true}
                    emptyMessage={t('list_empty')}
                >
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        header={t('action')}
                        body={renderActions}
                    ></Column>
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='internalCode'
                        header={t('code_of', { obj: t('module:department').toLowerCase() })}
                    ></Column>
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='name'
                        header={t('name_of', { obj: t('module:department').toLowerCase() })}
                    ></Column>
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='address'
                        header={t('address')}
                    ></Column>
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='phoneNumber'
                        header={t('phone_number')}
                    ></Column>
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='email'
                        header={t('email')}
                    ></Column>
                </DataTable>

                <div className='flex align-items-center justify-content-between bg-white px-3 py-2'>
                    <Dropdown
                        id='date_created_filter'
                        value={0}
                        onSelect={(sort) => {
                            setParams((prev) => ({
                                ...prev,
                                sorts: request.handleSort(sort, prev),
                            }));
                        }}
                        options={[
                            {
                                label: `${t('filter_date_created_down')}`,
                                value: 0,
                                name: 'DateCreated',
                                code: 'date_decrease',
                            },
                            {
                                label: `${t('filter_date_created_up')}`,
                                value: 1,
                                name: 'DateCreated',
                                code: 'date_increase',
                            },
                        ]}
                    />

                    <Paginator
                        first={meta.currentPage - 1}
                        rows={meta.pageSize}
                        totalRecords={meta.totalCount}
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        onPageChange={onPageChange}
                        className='border-noround p-0'
                    />
                </div>
            </div>

            <DepartmentForm
                lng={lng}
                title={
                    selected?.id
                        ? t('update_at', { obj: selected.name })
                        : t('create_new_at', { obj: t('module:department').toLowerCase() })
                }
                ref={formRef}
                onSuccess={(department) => queryClient.refetchQueries({ queryKey: ['departments'] })}
            />
        </div>
    );
};

export default DepartmentPage;
