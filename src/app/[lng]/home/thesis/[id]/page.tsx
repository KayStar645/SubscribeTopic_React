'use client';

import { API, MODULE } from '@assets/configs';
import { request } from '@assets/helpers';
import usePermission from '@assets/hooks/usePermission';
import { MajorType, TeacherType, ThesisParamType, ThesisType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Editor, InputRange, InputText } from '@resources/components/form';
import { MultiSelect } from '@resources/components/form/MultiSelect';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const defaultValues: ThesisType = {
    id: '0',
    internalCode: '',
    name: '',
    summary: '',
    thesisReviewsId: [],
    thesisInstructionsId: [],
    thesisMajorsId: [],
};

const schema = (t: TFunction) =>
    yup.object({
        internalCode: yup.string().required(),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:thesis') }).toLowerCase(),
            }),
        ),
    });

const ThesisForm = ({ params: _params }: PageProps) => {
    const { lng, id } = _params;
    const { t } = useTranslation(lng);
    const router = useRouter();
    const permission = usePermission(MODULE.thesis);

    const { control, handleSubmit, setValue, reset, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<ThesisType>,
        defaultValues,
    });

    const thesisDetailQuery = useQuery<ThesisType | null, AxiosError<ResponseType>>({
        queryKey: ['thesis_detail'],
        refetchOnWindowFocus: false,
        enabled: id !== '0',
        queryFn: async () => {
            const params: ThesisParamType = {
                id,
                isAllDetail: true,
            };

            const response = await request.get<ThesisType>(API.admin.detail.thesis, { params });

            return response.data.data;
        },
        onSuccess(data) {
            if (data) {
                data.thesisInstructionsId = (data.thesisInstructions || [])?.map((t) => parseInt(t.id?.toString()!));
                data.thesisMajorsId = (data.thesisMajors || [])?.map((t) => parseInt(t.id?.toString()!));
                data.thesisReviewsId = (data.thesisReviews || [])?.map((t) => parseInt(t.id?.toString()!));

                reset(data);
            }
        },
        onError: (err) => {
            toast.error(err.response?.data.messages?.[0] || err.message);
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

    const thesisMutation = useMutation<any, AxiosError<ResponseType>, ThesisType | null>({
        mutationFn: async (data) => {
            return id == '0'
                ? request.post<ThesisType>(API.admin.thesis, data)
                : request.update<ThesisType>(API.admin.thesis, data);
        },
    });

    const onSubmit = (data: ThesisType) => {
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

    return (
        <div
            style={{ height: 'calc(100% - 2rem)', marginRight: '-1rem', marginTop: '-1rem' }}
            className='py-3 pr-3 overflow-auto'
        >
            <Loader
                show={
                    thesisMutation.isLoading ||
                    thesisDetailQuery.isFetching ||
                    majorQuery.isFetching ||
                    teacherQuery.isFetching
                }
            />

            <form className='flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Card title={t('common:info_of', { obj: t('module:teacher').toLowerCase() })} className='w-30rem'>
                    <div className='flex flex-column gap-3'>
                        <div className='flex align-items-center'>
                            <p className='w-15rem'>{t('common:name_of', { obj: t('module:teacher').toLowerCase() })}</p>
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
                            <p className='text-900 font-semibold'>{getValues('lecturerThesis.academicTitle')}</p>
                        </div>
                    </div>
                </Card>

                <Card title={t('common:info_of', { obj: t('module:thesis').toLowerCase() })}>
                    <div className='flex gap-3'>
                        <div className='col-7 flex-1 flex flex-column gap-3 '>
                            <Controller
                                name='internalCode'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id='form_data_internal_code'
                                        value={field.value}
                                        label={t('common:code_of', { obj: t('module:thesis').toLowerCase() })}
                                        placeholder={t('common:code_of', { obj: t('module:thesis').toLowerCase() })}
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
                                        id='form_data_name'
                                        value={field.value}
                                        label={t('common:name_of', { obj: t('module:thesis').toLowerCase() })}
                                        placeholder={t('common:name_of', { obj: t('module:thesis').toLowerCase() })}
                                        errorMessage={fieldState.error?.message}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <Controller
                                name='summary'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Editor
                                        label={t('common:summary')}
                                        value={field.value}
                                        onChange={(data) => setValue(field.name, data)}
                                        errorMessage={fieldState.error?.message}
                                    />
                                )}
                            />

                            <InputRange
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
                                        label={t('module:field.thesis.instruction')}
                                        emptyMessage={t('common:list_empty')}
                                        value={field.value}
                                        options={teacherQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
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
                                            label={t('module:field.thesis.review')}
                                            emptyMessage={t('common:list_empty')}
                                            value={field.value}
                                            options={teacherQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                            onChange={(e) => field.onChange(e.value)}
                                        />
                                    )}
                                />
                            )}
                        </div>
                    </div>

                    <div
                        className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white px-6 h-4rem shadow-8'
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
                </Card>
            </form>
        </div>
    );
};

export default ThesisForm;
