'use client';

import { API, ROWS_PER_PAGE } from '@assets/configs';
import { request } from '@assets/helpers';
import { FacultyParamType, FacultyType } from '@assets/interface';
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
import FacultyForm, { FacultyFormRefType } from './form';

const FacultyPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const formRef = useRef<FacultyFormRefType>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const toastRef = useRef<Toast>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const [params, setParams] = useState<FacultyParamType>({
        page: meta.currentPage,
        pageSize: meta.pageSize,
        sorts: '-DateCreated',
    });
    const [selected, setSelected] = useState<FacultyType>();

    const queryClient = useQueryClient();
    const facultyQuery = useQuery<AxiosResponse, AxiosError<any, any>, FacultyType[]>({
        queryKey: ['faculties', 'list', params],
        queryFn: async () => {
            const response = await request.get(`${API.admin.faculty}`, { params });

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
    const facultyMutation = useMutation<AxiosResponse, AxiosError<any, any>, FacultyType>({
        mutationFn: (data: FacultyType) => {
            return request.remove(`${API.admin.faculty}`, { params: { id: data.id } });
        },
    });

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setParams((prev) => ({ ...prev, pageSize: e.rows, currentPage: e.first + 1 }));
    };

    const renderActions = (faculty: FacultyType) => {
        return (
            <div className='flex align-items-center gap-3'>
                <i
                    className='pi pi-pencil hover:text-primary cursor-pointer'
                    onClick={() => {
                        formRef.current?.show?.(faculty);
                        setSelected(faculty);
                    }}
                ></i>
                <i
                    className='pi pi-trash hover:text-red-600 cursor-pointer'
                    onClick={(e) => {
                        confirmModalRef.current?.show?.(e, faculty, t('sure_to_delete', { obj: faculty.name }));
                    }}
                ></i>
            </div>
        );
    };

    const onRemoveFaculty = (faculty: FacultyType) => {
        facultyMutation.mutate(faculty, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ['faculties'] });
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
                onAccept={onRemoveFaculty}
                acceptLabel={t('confirm')}
                rejectLabel={t('cancel')}
            />

            <div className='flex align-items-center justify-content-between bg-white py-2 px-3 border-round-lg shadow-3'>
                <p className='text-xl font-semibold'>{t('list_of', { module: t('module:faculty').toLowerCase() })}</p>
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
                <InputText placeholder={`${t('search')}...`} />
            </div>
            <div className='border-round-xl overflow-hidden relative shadow-5'>
                <Loader show={facultyQuery.isLoading || facultyMutation.isLoading} />

                <DataTable
                    value={facultyQuery.data || []}
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
                        header={t('code_of', { obj: t('module:faculty').toLowerCase() })}
                    ></Column>
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='name'
                        header={t('name_of', { obj: t('module:faculty').toLowerCase() })}
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
                        value='date_decrease'
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

            <FacultyForm
                lng={lng}
                title={
                    selected?.id
                        ? t('update_at', { obj: selected.name })
                        : t('create_new_at', { obj: t('module:faculty').toLowerCase() })
                }
                ref={formRef}
                onSuccess={(faculty) => queryClient.refetchQueries({ queryKey: ['faculties'] })}
            />
        </div>
    );
};

export default FacultyPage;
