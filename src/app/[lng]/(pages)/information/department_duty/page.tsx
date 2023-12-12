'use client';

import { API, MODULE, ROUTES, ROWS_PER_PAGE } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { DutyParamType, DutyType, DepartmentType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import { MetaType, ResponseType } from '@assets/types/request';
import { Dropdown, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Loader } from '@resources/components/UI';
import { ConfirmModal } from '@resources/components/modal';
import { AxiosError } from 'axios';
import { DATE_FILTER } from '@assets/configs/general';
import usePermission from '@assets/hooks/usePermission';
import Link from 'next/link';

const DepartmentDutyPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const permission = usePermission(MODULE.duty);

    const [params, setParams] = useState<DutyParamType>({
        page: meta.currentPage,
        pageSize: meta.pageSize,
        sorts: '-DateCreated',
        type: 'D',
    });

    const departmentDutyQuery = useQuery<DutyType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['faculties', 'list', params],
        queryFn: async () => {
            const response = await request.get<DutyType[]>(`${API.admin.duty}`, { params });

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
    });

    const departmentDutyMutation = useMutation<any, AxiosError<ResponseType>, DutyType>({
        mutationFn: (data) => {
            return request.remove(`${API.admin.duty}`, { params: { id: data.id } });
        },
    });

    const departmentQuery = useQuery<DepartmentType[] | [], AxiosError<ResponseType>>({
        queryKey: ['departments'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<DepartmentType[]>(`${API.admin.department}`);

            return response.data.data || [];
        },
    });

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setParams((prev) => ({ ...prev, pageSize: e.rows, currentPage: e.first + 1 }));
    };

    const renderActions = (data: DutyType) => {
        return (
            <div className='flex align-items-center justify-content-center gap-3'>
                {permission.update && (
                    <Link href={language.addPrefixLanguage(lng, `${ROUTES.information.department_duty}/${data.id}`)}>
                        <i className='pi pi-pencil hover:text-primary cursor-pointer' />
                    </Link>
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

    const onRemove = (data: DutyType) => {
        departmentDutyMutation.mutate(data, {
            onSuccess: () => {
                departmentDutyQuery.refetch();
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
                <p className='text-xl font-semibold'>Danh sách nhiệm vụ bộ môn</p>

                <Link href={language.addPrefixLanguage(lng, `${ROUTES.information.department_duty}/0`)}>
                    <Button label={t('create_new')} icon='pi pi-plus' size='small' visible={permission.create} />
                </Link>
            </div>

            <div className='flex align-items-center'>
                <InputText id='form_data_keyword' label={`${t('search')}`} placeholder={`${t('search')}`} />
            </div>

            <div className='border-round-xl overflow-hidden relative shadow-5'>
                <Loader show={departmentDutyQuery.isFetching || departmentDutyMutation.isPending} />

                <DataTable
                    value={departmentDutyQuery.data}
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
                            whiteSpace: 'nowrap',
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
                        header='Tên nhiệm vụ'
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='teacher.name'
                        header='Giảng viên'
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='numberOfThesis'
                        header='Số lượng đề tài'
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
        </div>
    );
};

export default DepartmentDutyPage;
