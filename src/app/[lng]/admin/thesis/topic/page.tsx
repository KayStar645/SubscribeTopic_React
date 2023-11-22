'use client';

import { API, MODULE, ROUTES, ROWS_PER_PAGE } from '@assets/configs';
import { DATE_FILTER } from '@assets/configs/general';
import { language, request } from '@assets/helpers';
import usePermission from '@assets/hooks/usePermission';
import { TeacherType, TopicParamType, TopicType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import { MetaType, ResponseType } from '@assets/types/request';
import { Loader } from '@resources/components/UI';
import { Dropdown } from '@resources/components/form';
import { ConfirmModal } from '@resources/components/modal';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebouncedCallback } from 'use-debounce';

const ThesisPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const router = useRouter();
    const permission = usePermission(MODULE.topic);

    const debounceKeyword = useDebouncedCallback((keyword) => {
        setParams((prev) => ({
            ...prev,
            filters: request.handleFilter(prev.filters, '(internalCode|name)', '@=', keyword),
        }));
    }, 600);

    const [params, setParams] = useState<TopicParamType>({
        page: meta.currentPage,
        pageSize: meta.pageSize,
        sorts: '-DateCreated',
        filters: '',
        isAllDetail: true,
    });

    const thesisQuery = useQuery<TopicType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['thesis', 'list', params],
        queryFn: async () => {
            const response = await request.get<TopicType[]>(`${API.admin.topic}`, { params });

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
            if (err.response?.status === 403) {
                toast.error('Bạn không có quyền thao tác');
            }
        },
    });

    const teacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        queryKey: ['thesis_teachers_filter', 'list'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<TeacherType[]>(API.admin.teacher);

            return response.data.data || [];
        },
    });

    const thesisMutation = useMutation<any, AxiosError<ResponseType>, TopicType>({
        mutationFn: (data) => {
            return request.remove(`${API.admin.topic}`, { params: { id: data.id } });
        },
    });

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setParams((prev) => ({ ...prev, pageSize: e.rows, currentPage: e.first + 1 }));
    };

    const renderActions = (data: TopicType) => {
        return (
            <div className='flex align-items-center gap-3'>
                {permission.update && (
                    <i
                        className='pi pi-pencil hover:text-primary cursor-pointer'
                        onClick={() =>
                            router.push(language.addPrefixLanguage(lng, `${ROUTES.thesis.topic}/${data.id}`))
                        }
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

    const onRemove = (data: TopicType) => {
        thesisMutation.mutate(data, {
            onSuccess: () => {
                thesisQuery.refetch();
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
                <p className='text-xl font-semibold'>{t('list_of', { module: t('module:thesis').toLowerCase() })}</p>

                {permission.create && (
                    <Button
                        label={t('create_new')}
                        icon='pi pi-plus'
                        size='small'
                        onClick={() => router.push(language.addPrefixLanguage(lng, `${ROUTES.thesis.topic}/0`))}
                    />
                )}
            </div>

            <div className='flex align-items-center gap-3'>
                <InputText
                    placeholder={`${t('search')}...`}
                    className='w-20rem'
                    onChange={(e) => debounceKeyword(e.target.value)}
                />

                <Dropdown
                    id='thesis_lecturer'
                    showClear={true}
                    placeholder={t('module:field.thesis.lecturer')}
                    options={teacherQuery?.data?.map((t) => ({ label: t.name, value: t.id }))}
                    onChange={(teacherId) => {
                        setParams((prev) => {
                            return {
                                ...prev,
                                filters: request.handleFilter(prev.filters || '', 'lecturerThesisId', '==', teacherId),
                            };
                        });
                    }}
                />
            </div>

            <div className='border-round-xl overflow-hidden relative shadow-5'>
                <Loader show={thesisQuery.isFetching || thesisMutation.isLoading || teacherQuery.isFetching} />

                <DataTable
                    value={thesisQuery.data}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={t('list_empty')}
                >
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
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
                        header={t('common:code_of', { obj: t('module:thesis').toLowerCase() })}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='name'
                        header={t('common:name_of', { obj: t('module:thesis').toLowerCase() })}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='lecturerThesis.name'
                        header={t('module:field.thesis.lecturer')}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={t('module:field.thesis.instruction')}
                        body={(data: TopicType) => <p>{data.thesisInstructions?.map((t) => t.name).join(', ')}</p>}
                    />
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={t('module:field.thesis.review')}
                        body={(data: TopicType) => <p>{data.thesisReviews?.map((t) => t.name).join(', ')}</p>}
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

export default ThesisPage;
