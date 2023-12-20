'use client';

import { API, MODULE, ROUTES, ROWS_PER_PAGE } from '@assets/configs';
import { DATE_FILTER } from '@assets/configs/general';
import { language, request } from '@assets/helpers';
import usePermission from '@assets/hooks/usePermission';
import { RegistrationPeriodType, TopicParamType, TopicType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import { MetaType, ResponseType } from '@assets/types/request';
import { Loader } from '@resources/components/UI';
import { Dropdown, InputText } from '@resources/components/form';
import { ConfirmModal } from '@resources/components/modal';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebouncedCallback } from 'use-debounce';

const GroupPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
    const router = useRouter();
    const permission = usePermission(MODULE.job);

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
        enabled: !!params.periodId,
        refetchOnWindowFocus: false,
        queryKey: ['thesis', 'list', params],
        queryFn: async () => {
            const response = await request.get<TopicType[]>(`${API.admin.custom.thesis.topic_by_teacher}`, { params });

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

    const registrationPeriodQuery = useQuery<RegistrationPeriodType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['registration_periods', 'list'],
        queryFn: async () => {
            const response = await request.get<RegistrationPeriodType[]>(`${API.admin.registration_period}`);

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
            <div className='flex align-items-center justify-content-center gap-3'>
                {permission.create && (
                    <i
                        className='pi pi-book hover:text-primary cursor-pointer'
                        onClick={() =>
                            router.push(language.addPrefixLanguage(lng, `${ROUTES.thesis.job_detail}/${data.id}`))
                        }
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
                <p className='text-xl font-semibold'>
                    {t('list_of', { module: t('module:field.job.instruction_topic').toLowerCase() })}
                </p>
            </div>

            <div className='flex align-items-center'>
                <InputText
                    id='search'
                    label='Tìm kiếm'
                    blockClassName='col-3'
                    placeholder={`${t('search')}...`}
                    onChange={(e) => debounceKeyword(e.target.value)}
                />

                <Dropdown
                    id='form_data_teacher_id'
                    options={registrationPeriodQuery.data?.map((t) => ({
                        label: `Năm học ${t.schoolYear} _ ${t.semester} _ Đợt ${t.phase}`,
                        value: t.id,
                    }))}
                    value={params.periodId}
                    label='Đợt đăng ký'
                    placeholder='Đợt đăng ký'
                    onChange={(e) =>
                        setParams((prev) => ({
                            ...prev,
                            periodId: parseInt(e),
                        }))
                    }
                />
            </div>

            {params.periodId && (
                <div className='border-round-xl overflow-hidden relative shadow-5'>
                    <Loader show={thesisQuery.isFetching || thesisMutation.isPending} />

                    <DataTable
                        value={thesisQuery.data}
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
                            field='internalCode'
                            header={t('common:code_of', { obj: t('module:thesis').toLowerCase() })}
                        />
                        <Column
                            alignHeader='center'
                            headerStyle={{
                                background: 'var(--primary-color)',
                                color: 'var(--surface-a)',
                                whiteSpace: 'nowrap',
                            }}
                            field='name'
                            header={t('common:name_of', { obj: t('module:thesis').toLowerCase() })}
                        />
                        <Column
                            alignHeader='center'
                            headerStyle={{
                                background: 'var(--primary-color)',
                                color: 'var(--surface-a)',
                                whiteSpace: 'nowrap',
                            }}
                            header={t('module:field.thesis.instruction')}
                            body={(data: TopicType) => <p>{data.thesisInstructions?.map((t) => t.name).join(', ')}</p>}
                        />
                        <Column
                            alignHeader='center'
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
            )}
        </div>
    );
};

export default GroupPage;
