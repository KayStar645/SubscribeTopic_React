'use client';

import { API, ROWS_PER_PAGE } from '@assets/configs';
import { dateFilters } from '@assets/configs/general';
import { request } from '@assets/helpers';
import { GroupParamType, GroupType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { MetaType, ResponseType } from '@assets/types/request';
import { Loader } from '@resources/components/UI';
import { Dropdown } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import GroupForm, { GroupFormRefType } from './form';

const GroupPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const formRef = useRef<GroupFormRefType>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const [selected, setSelected] = useState<GroupType>();

    const [params, setParams] = useState<GroupParamType>({
        page: meta.currentPage,
        pageSize: meta.pageSize,
        sorts: '-DateCreated',
        isGetLeader: true,
    });

    const groupQuery = useQuery<GroupType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['industries', 'list', params],
        queryFn: async () => {
            const response = await request.get<GroupType[]>(`${API.admin.group}`, { params });

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

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setParams((prev) => ({ ...prev, pageSize: e.rows, currentPage: e.first + 1 }));
    };

    const renderActions = (data: GroupType) => {
        return (
            <i
                className='pi pi-pencil hover:text-primary cursor-pointer'
                onClick={() => {
                    formRef.current?.show?.(data);
                    setSelected(data);
                }}
            />
        );
    };

    const rowExpansionTemplate = (data: GroupType) => {
        return (
            <div className='p-3'>
                <p>{t('module:field.group.members')}</p>
                <DataTable value={data.members}>
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='student.internalCode'
                        header={t('code_of', { obj: t('module:student').toLowerCase() })}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='student.name'
                        header={t('name_of', { obj: t('module:student').toLowerCase() })}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='student.major.name'
                        header={t('name_of', { obj: t('module:major').toLowerCase() })}
                    />
                    <Column headerStyle={{ width: '4rem' }} />
                </DataTable>
            </div>
        );
    };

    const allowExpansion = (data: GroupType) => {
        return data.members ? data.members.length > 0 : false;
    };

    return (
        <div className='flex flex-column gap-4'>
            <div className='flex align-items-center justify-content-between bg-white p-3 border-round-lg shadow-3'>
                <p className='text-xl font-semibold'>{t('list_of', { module: t('module:group').toLowerCase() })}</p>
            </div>

            <div className='flex align-items-center justify-content-between'>
                <InputText placeholder={`${t('search')}...`} className='col-4' />
            </div>

            <div className='border-round-xl overflow-hidden relative shadow-5'>
                <Loader show={groupQuery.isLoading} />

                <DataTable
                    value={groupQuery.data}
                    rowExpansionTemplate={rowExpansionTemplate}
                    tableStyle={{ minWidth: '60rem' }}
                >
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        expander={allowExpansion}
                        style={{ width: '5rem' }}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        header={t('action')}
                        body={renderActions}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='name'
                        header={t('name_of', { obj: t('module:group').toLowerCase() })}
                    />
                    <Column
                        headerStyle={{ background: 'var(--primary-color)', color: 'var(--surface-a)' }}
                        field='countMember'
                        header={t('module:field.group.count_member')}
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

            <GroupForm
                lng={lng}
                title={
                    selected?.id
                        ? t('update_at', { obj: selected.name })
                        : t('create_new_at', { obj: t('module:group').toLowerCase() })
                }
                ref={formRef}
            />
        </div>
    );
};

export default GroupPage;
