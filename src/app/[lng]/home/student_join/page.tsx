'use client';

import { API, ROWS_PER_PAGE } from '@assets/configs';
import { request } from '@assets/helpers';
import { StudentJoinParamType, StudentJoinType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import { MetaType, ResponseType } from '@assets/types/request';
import { Loader } from '@resources/components/UI';
import { Dropdown } from '@resources/components/form';
import { ConfirmModal } from '@resources/components/modal';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import StudentJoinForm, { StudentJoinFormRefType } from './form';
import { dateFilters } from '@assets/configs/general';

const StudentJoinPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const formRef = useRef<StudentJoinFormRefType>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const [selected, setSelected] = useState<StudentJoinType>();

    const [params, setParams] = useState<StudentJoinParamType>({
        page: meta.currentPage,
        pageSize: meta.pageSize,
        sorts: '-DateCreated',
        isGetStudent: true,
        isGetRegistrationPeriod: true,
    });

    const studentJoinQuery = useQuery<StudentJoinType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['student_joins', 'list', params],
        queryFn: async () => {
            const response = await request.get<StudentJoinType[]>(`${API.admin.student_join}`, { params });

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

    const studentJoinMutation = useMutation<any, AxiosError<ResponseType>, StudentJoinType>({
        mutationFn: (data) => {
            return request.remove(`${API.admin.student_join}`, { params: { id: data.id } });
        },
    });

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setParams((prev) => ({ ...prev, pageSize: e.rows, currentPage: e.first + 1 }));
    };

    const renderActions = (data: StudentJoinType) => {
        return (
            <div className='flex align-items-center gap-3'>
                <i
                    className='pi pi-pencil hover:text-primary cursor-pointer'
                    onClick={() => {
                        formRef.current?.show?.(data);
                        setSelected(data);
                    }}
                />
                <i
                    className='pi pi-trash hover:text-red-600 cursor-pointer'
                    onClick={(e) => {
                        confirmModalRef.current?.show?.(e, data, t('sure_to_delete', { obj: data.name }));
                    }}
                />
            </div>
        );
    };

    const onRemove = (data: StudentJoinType) => {
        studentJoinMutation.mutate(data, {
            onSuccess: () => {
                studentJoinQuery.refetch();

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

            <div className='flex align-items-center justify-content-between bg-white py-2 px-3 border-round-lg shadow-3'>
                <p className='text-xl font-semibold'>
                    {t('list_of', { module: t('module:student_join').toLowerCase() })}
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
                <Loader show={studentJoinQuery.isLoading || studentJoinMutation.isLoading} />

                <DataTable
                    value={studentJoinQuery.data || []}
                    rowHover={true}
                    stripedRows={true}
                    emptyMessage={t('list_empty')}
                >
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        header={t('action')}
                        body={renderActions}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='student.name'
                        header={t('name_of', { obj: t('module:student').toLowerCase() })}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='registrationPeriod.schoolYear'
                        header={t('module:field.registration_period.school_year')}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='registrationPeriod.semester'
                        header={t('module:field.registration_period.semester')}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='registrationPeriod.phase'
                        header={t('module:field.registration_period.phase')}
                    />
                </DataTable>

                <div className='flex align-items-center justify-content-between bg-white px-3 py-2'>
                    <Dropdown
                        id='date_created_filter'
                        value='date_decrease'
                        optionValue='code'
                        onChange={(sortCode) => {
                            const filter = dateFilters(t).find((t) => t.code === sortCode);

                            setParams((prev) => {
                                return {
                                    ...prev,
                                    sorts: request.handleSort(filter, prev),
                                };
                            });
                        }}
                        options={dateFilters(t)}
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

            <StudentJoinForm
                lng={lng}
                title={
                    selected?.id
                        ? t('update_at', { obj: selected.name })
                        : t('create_new_at', { obj: t('module:student_join').toLowerCase() })
                }
                ref={formRef}
                onSuccess={(data) => studentJoinQuery.refetch()}
            />
        </div>
    );
};

export default StudentJoinPage;
