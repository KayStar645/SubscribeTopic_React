'use client';

import { API, AUTH_TOKEN, MODULE } from '@assets/configs';
import { THESIS_STATUS } from '@assets/configs/general';
import { request } from '@assets/helpers';
import usePermission from '@assets/hooks/usePermission';
import {
    AuthType,
    DepartmentDutyParamType,
    DepartmentDutyType,
    MajorType,
    TeacherType,
    TopicParamType,
    TopicType,
} from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Editor, InputRange, InputText } from '@resources/components/form';
import { MultiSelect } from '@resources/components/form/MultiSelect';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction, t } from 'i18next';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { createContext, useEffect, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import TopicFeedback from './Feedback';
import useCookies from '@assets/hooks/useCookies';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RadioButton } from 'primereact/radiobutton';

interface TopicPageContextType {
    t: TFunction;
    id: string;
}

const TopicPageContext = createContext<TopicPageContextType>({
    t,
    id: '',
});

const defaultValues: TopicType = {
    id: '0',
    internalCode: '',
    name: '',
    summary: '',
    thesisReviewsId: [],
    thesisInstructionsId: [],
    thesisMajorsId: [],
    status: 'D',
};

const schema = (t: TFunction) =>
    yup.object({
        internalCode: yup.string().required(),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:thesis') }).toLowerCase(),
            }),
        ),
        status: yup.string().default('D').oneOf(['A', 'AR', 'D']),
    });

const TopicForm = ({ params: _params }: PageProps) => {
    const { lng, id } = _params;
    const { t } = useTranslation(lng);
    const router = useRouter();
    const permission = usePermission(MODULE.topic);
    const [visible, setVisible] = useState(false);
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);
    const [dutyId, setDutyId] = useState(0);

    const { control, handleSubmit, setValue, reset, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<TopicType>,
        defaultValues,
    });

    const thesisDetailQuery = useQuery<TopicType | null, AxiosError<ResponseType>>({
        queryKey: ['thesis_detail', id],
        refetchOnWindowFocus: false,
        enabled: id !== '0',
        queryFn: async () => {
            const params: TopicParamType = {
                id,
                isAllDetail: true,
            };

            const response = await request.get<TopicType>(API.admin.detail.topic, { params });

            return response.data.data;
        },
    });

    const majorQuery = useQuery<MajorType[], AxiosError<ResponseType>>({
        queryKey: ['thesis_majors', 'list'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<MajorType[]>(API.admin.major);

            return response.data.data || [];
        },
    });

    const teacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        queryKey: ['thesis_teachers', 'list'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<TeacherType[]>(API.admin.teacher);

            return response.data.data || [];
        },
    });

    const departmentDutyQuery = useQuery<DepartmentDutyType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['faculties', 'list'],
        enabled: !!auth?.customer.Id && visible,
        queryFn: async () => {
            const params: DepartmentDutyParamType = {
                filters: `teacherId==${auth?.customer.Id}`,
            };

            const response = await request.get<DepartmentDutyType[]>(`${API.admin.department_duty}`, { params });

            return response.data.data || [];
        },
    });

    const thesisMutation = useMutation<any, AxiosError<ResponseType>, TopicType | null>({
        mutationFn: async (data) => {
            return id == '0'
                ? request.post<TopicType>(API.admin.topic, data)
                : request.update<TopicType>(API.admin.topic, data);
        },
    });

    const thesisUpdateStatusMutation = useMutation({
        mutationFn: async (status: 'AR' | 'A' | 'D') => {
            const data: TopicType = {
                id,
                status,
            };

            if (dutyId > 0) {
                data['dutyId'] = dutyId;
            }

            return request.update<TopicType>(API.admin.approve.topic, data);
        },
    });

    const onSubmit = (data: TopicType) => {
        thesisMutation.mutate(data, {
            onSuccess: () => {
                toast.success(t('request:update_success'));
                router.back();
            },
            onError: (err) => {
                toast.error(err.response?.data.messages?.[0] || err.message);
            },
        });
    };

    const CardTitle = () => {
        let background = 'bg-gray-400';

        if (getValues('status') === 'A') {
            background = 'bg-green-600';
        } else {
            background = 'bg-blue-500';
        }

        return (
            <div className='flex align-items-center justify-content-between'>
                <div className='flex align-items-center gap-3'>
                    <p>{t('common:info_of', { obj: t('module:thesis').toLowerCase() })}</p>
                    <Chip
                        label={THESIS_STATUS(t)[getValues('status') || 'D']}
                        className={classNames(background, 'text-white')}
                    />
                </div>

                <div className='flex align-items-center gap-2'>
                    {getValues('status') == 'AR' && id != '0' && (
                        <Button
                            label={t('common:change_to_draft')}
                            size='small'
                            severity='warning'
                            onClick={(e) => {
                                e.preventDefault();
                                thesisUpdateStatusMutation.mutate('D', {
                                    onSuccess() {
                                        thesisDetailQuery.refetch();
                                        toast.success(t('request:update_success'));
                                    },
                                });
                            }}
                        />
                    )}

                    {getValues('status') == 'D' && id != '0' && (
                        <Button
                            label={t('common:approve_request')}
                            size='small'
                            severity='secondary'
                            onClick={(e) => {
                                e.preventDefault();

                                setVisible(true);
                            }}
                        />
                    )}

                    {getValues('status') == 'AR' && (
                        <Button
                            label={t('common:approve')}
                            size='small'
                            onClick={(e) => {
                                e.preventDefault();
                                thesisUpdateStatusMutation.mutate('A', {
                                    onSuccess() {
                                        thesisDetailQuery.refetch();
                                        toast.success(t('request:update_success'));
                                    },
                                });
                            }}
                        />
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (thesisDetailQuery.data) {
            thesisDetailQuery.data.thesisInstructionsId = (thesisDetailQuery.data.thesisInstructions || [])?.map((t) =>
                parseInt(t.id?.toString()!),
            );
            thesisDetailQuery.data.thesisMajorsId = (thesisDetailQuery.data.thesisMajors || [])?.map((t) =>
                parseInt(t.id?.toString()!),
            );
            thesisDetailQuery.data.thesisReviewsId = (thesisDetailQuery.data.thesisReviews || [])?.map((t) =>
                parseInt(t.id?.toString()!),
            );

            reset(thesisDetailQuery.data);
        } else {
            reset(defaultValues);
        }
    }, [reset, thesisDetailQuery.data]);

    const value: TopicPageContextType = {
        t,
        id,
    };

    return (
        <TopicPageContext.Provider value={value}>
            <div
                style={{
                    height: getValues('status') == 'D' ? 'calc(100% - 2rem)' : 'auto',
                    marginLeft: '-1rem',
                    marginRight: '-1rem',
                    marginTop: '-1rem',
                }}
                className='py-3 px-3 overflow-auto relative'
            >
                <Loader
                    show={
                        thesisMutation.isPending ||
                        thesisDetailQuery.isFetching ||
                        majorQuery.isFetching ||
                        teacherQuery.isFetching ||
                        thesisUpdateStatusMutation.isPending
                    }
                />

                <div className='flex flex-column gap-3'>
                    {getValues('lecturerThesis') && (
                        <Card title={t('module:field.thesis.lecturer')}>
                            <div className='flex flex-column gap-3'>
                                <div className='flex align-items-center'>
                                    <p className='w-15rem'>
                                        {t('common:name_of', { obj: t('module:teacher').toLowerCase() })}
                                    </p>
                                    <p className='text-900 font-semibold'>{getValues('lecturerThesis.name')}</p>
                                </div>

                                <div className='flex align-items-center'>
                                    <p className='w-15rem'>{t('common:email')}</p>
                                    <p className='text-900 font-semibold'>{getValues('lecturerThesis.email')}</p>
                                </div>

                                <div className='flex align-items-center'>
                                    <p className='w-15rem'>{t('common:phone_number')}</p>
                                    <p className='text-900 font-semibold'>{getValues('lecturerThesis.phoneNumber')}</p>
                                </div>

                                <div className='flex align-items-center'>
                                    <p className='w-15rem'>{t('module:field.teacher.academic')}</p>
                                    <p className='text-900 font-semibold'>
                                        {getValues('lecturerThesis.academicTitle')}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card title={<CardTitle />}>
                            <div className='flex gap-3 flex-wrap'>
                                <div className='col-7 flex-1 flex flex-column gap-3 '>
                                    <Controller
                                        name='internalCode'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                disabled={getValues('status') != 'D'}
                                                id='form_data_internal_code'
                                                value={field.value}
                                                label={t('common:code_of', { obj: t('module:thesis').toLowerCase() })}
                                                placeholder={t('common:code_of', {
                                                    obj: t('module:thesis').toLowerCase(),
                                                })}
                                                errorMessage={fieldState.error?.message}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name='name'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                disabled={getValues('status') != 'D'}
                                                id='form_data_name'
                                                value={field.value}
                                                label={t('common:name_of', { obj: t('module:thesis').toLowerCase() })}
                                                placeholder={t('common:name_of', {
                                                    obj: t('module:thesis').toLowerCase(),
                                                })}
                                                errorMessage={fieldState.error?.message}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />

                                    <InputRange
                                        disabled={getValues('status') != 'D'}
                                        id='form_data_min_max'
                                        max={10}
                                        label={t('module:field.thesis.quantity')}
                                        minPlaceHolder={t('common:min')}
                                        maxPlaceHolder={t('common:max')}
                                        value={[getValues('minQuantity'), getValues('maxQuantity')]}
                                        onChange={([min, max]) => {
                                            setValue('minQuantity', min);
                                            setValue('maxQuantity', max);
                                        }}
                                    />
                                </div>

                                <div className='col-5 flex flex-column gap-3'>
                                    <Controller
                                        control={control}
                                        name='thesisMajorsId'
                                        render={({ field }) => (
                                            <MultiSelect
                                                disabled={getValues('status') != 'D'}
                                                id={`thesisMajorsId_${field.value}`}
                                                label={t('module:field.thesis.major')}
                                                emptyMessage={t('common:list_empty')}
                                                value={field.value}
                                                options={majorQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name='thesisInstructionsId'
                                        render={({ field }) => (
                                            <MultiSelect
                                                disabled={getValues('status') == 'AR'}
                                                id={`thesisInstructionsId_${field.value}`}
                                                label={t('module:field.thesis.instruction')}
                                                emptyMessage={t('common:list_empty')}
                                                value={field.value}
                                                options={teacherQuery.data?.map((t) => ({
                                                    label: t.name,
                                                    value: t.id,
                                                }))}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        )}
                                    />

                                    {id != '0' && (
                                        <Controller
                                            control={control}
                                            name='thesisReviewsId'
                                            render={({ field }) => (
                                                <MultiSelect
                                                    disabled={getValues('status') == 'AR'}
                                                    id={`thesisReviewsId_${field.value}`}
                                                    label={t('module:field.thesis.review')}
                                                    emptyMessage={t('common:list_empty')}
                                                    value={field.value}
                                                    options={teacherQuery.data?.map((t) => ({
                                                        label: t.name,
                                                        value: t.id,
                                                    }))}
                                                    onChange={(e) => field.onChange(e.value)}
                                                />
                                            )}
                                        />
                                    )}
                                </div>

                                <div className='col-12'>
                                    <Controller
                                        name='summary'
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Editor
                                                disabled={getValues('status') != 'D'}
                                                id='form_data_summary'
                                                label={t('common:summary')}
                                                value={field.value}
                                                onChange={(data) => setValue(field.name, data)}
                                                errorMessage={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {getValues('status') != 'AR' && (
                                <div
                                    className='flex align-items-center justify-content-end gap-2 fixed bottom-0 left-0 right-0 bg-white px-5 h-4rem shadow-8'
                                    style={{ zIndex: 500 }}
                                >
                                    <Button
                                        size='small'
                                        label={t('cancel')}
                                        icon='pi pi-undo'
                                        severity='secondary'
                                        onClick={() => {
                                            router.back();
                                        }}
                                    />
                                    {permission.update && <Button size='small' label={t('save')} icon='pi pi-save' />}
                                </div>
                            )}
                        </Card>
                    </form>

                    {id != '0' && (
                        <TopicFeedback showInput={getValues('status') == 'D' || getValues('status') == 'AR'} />
                    )}
                </div>
            </div>

            <Dialog
                header='Đề tài thuộc nhiệm vụ'
                onHide={() => {
                    setDutyId(0);
                    setVisible(false);
                }}
                visible={visible}
                style={{ width: '50vw' }}
                className='relative overflow-hidden'
            >
                <Loader show={departmentDutyQuery.isFetching} />

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
                        body={(data: DepartmentDutyType) => (
                            <div className='flex align-items-center justify-content-center'>
                                <RadioButton
                                    checked={data.id === dutyId}
                                    onChange={() => setDutyId(parseInt(data.id?.toString()!))}
                                />
                            </div>
                        )}
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
                        field='numberOfThesis'
                        header='Số lượng đề tài'
                    />
                </DataTable>

                <div className='flex align-items-center justify-content-end mt-3'>
                    <Button
                        label={t('common:approve_request')}
                        size='small'
                        severity='secondary'
                        onClick={(e) => {
                            e.preventDefault();

                            thesisUpdateStatusMutation.mutate('AR', {
                                onSuccess() {
                                    setDutyId(0);
                                    setVisible(false);
                                    thesisDetailQuery.refetch();
                                    toast.success(t('request:update_success'));
                                },
                            });
                        }}
                    />
                </div>
            </Dialog>
        </TopicPageContext.Provider>
    );
};

export default TopicForm;
export { TopicPageContext };
