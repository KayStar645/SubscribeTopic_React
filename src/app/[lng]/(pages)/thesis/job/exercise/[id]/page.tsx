'use client';

import { API, AUTH_TOKEN, ROUTES } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { HTML } from '@assets/helpers/string';
import useCookies from '@assets/hooks/useCookies';
import { AuthType, JobParamType, JobType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Editor, InputDate, InputFile, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { ToggleButton } from 'primereact/togglebutton';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { FaUserGroup } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const defaultValues: JobType = {
    id: 0,
    name: '',
    instructions: '',
    due: new Date(),
    files: [],
};

const schema = (t: TFunction) =>
    yup.object({
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:job') }).toLowerCase(),
            }),
        ),
        instructions: yup.string().required(),
        due: yup.date(),
    });

const ExercisePage = ({ params, searchParams }: PageProps) => {
    const { id, lng } = params;
    const { topicId } = searchParams;
    const { t } = useTranslation(lng);
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);
    const [edit, setEdit] = useState(false);
    const router = useRouter();

    const jobDetail = useQuery<JobType | null, AxiosError<ResponseType>>({
        queryKey: ['job_detail', id],
        refetchOnWindowFocus: false,
        enabled: id !== '0',
        queryFn: async () => {
            const params: JobParamType = {
                id,
                isAllDetail: true,
            };

            const response = await request.get<JobType>(API.admin.detail.job, { params });

            return response.data.data;
        },
    });

    const jobMutation = useMutation<any, AxiosError<ResponseType>, JobType>({
        mutationFn: async (data) => {
            data.thesisId = topicId;

            return id == '0'
                ? request.post(API.admin.job, {
                      ...data,
                      files: data?.files?.map((t) => t.path),
                      due: moment(data.due).format('YYYY-MM-DDTHH:mm'),
                  })
                : request.update(API.admin.job, {
                      ...data,
                      files: data?.files?.map((t) => t.path),
                      due: moment(data.due).format('YYYY-MM-DDTHH:mm'),
                  });
        },
    });

    const { control, handleSubmit, reset, getValues, setValue } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<JobType>,
        defaultValues,
    });

    const onSubmit = (data: JobType) => {
        jobMutation.mutate(data, {
            onSuccess: () => {
                setEdit(false);
                router.push(language.addPrefixLanguage(lng, `${ROUTES.thesis.job_detail}/${id}`));
                toast.success(t('request:update_success'));
            },
        });
    };

    useEffect(() => {
        if (jobDetail.data) {
            reset(jobDetail.data);
        }
    }, [jobDetail.data, reset]);

    return (
        <form className='flex pr-2 gap-5' onSubmit={handleSubmit(onSubmit)}>
            <Loader show={jobDetail.isFetching || jobMutation.isPending} />

            <div className='flex-1'>
                <div className='flex gap-3'>
                    <Button icon='pi pi-book' rounded={true} className='w-3rem h-3rem' />

                    <div className='flex-1'>
                        <div
                            className={classNames('border-blue-700 pb-3', {
                                'border-bottom-1 ': id > 0,
                            })}
                        >
                            <div className='flex gap-3'>
                                <div className='flex-1'>
                                    {id == 0 || edit ? (
                                        <Controller
                                            control={control}
                                            name='name'
                                            render={({ field, fieldState }) => (
                                                <InputText
                                                    id='form_data_name'
                                                    placeholder={t('common:name_of', {
                                                        obj: t('module:job').toLowerCase(),
                                                    })}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    errorMessage={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <p className='font-semibold text-3xl text-blue-700 mt-1'>
                                            {jobDetail.data?.name}
                                        </p>
                                    )}
                                </div>

                                {id > 0 ? (
                                    <>
                                        {edit ? (
                                            <Button label='Lưu' icon='pi pi-save' className='py-2' />
                                        ) : (
                                            <Button
                                                label='Cập nhập'
                                                icon='pi pi-pencil'
                                                className='py-2'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setEdit(true);
                                                }}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <Button icon='pi pi-save' rounded={true} tooltip='Thêm mới' />
                                )}
                            </div>

                            <div className='flex align-items-center justify-content-between my-3'>
                                <p className='text-sm text-700'>
                                    {id > 0
                                        ? jobDetail.data?.teacherBy?.name +
                                          ' • ' +
                                          moment(jobDetail.data?.lastModifiedDate).format('DD MMM')
                                        : `${auth?.customer.Name} • ${moment().format('DD MMM')}`}
                                </p>

                                {id == 0 || edit ? (
                                    <Controller
                                        control={control}
                                        name='due'
                                        render={({ field }) => (
                                            <InputDate
                                                id='form_data_due'
                                                label={t('module:field.job.due')}
                                                placeholder={t('module:field.job.due')}
                                                time={true}
                                                row={true}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                ) : (
                                    <p className='text-sm font-semibold text-900'>
                                        Đến hạn {moment(jobDetail.data?.due).format('HH:mm DD MMM')}
                                    </p>
                                )}
                            </div>

                            <div>
                                {id == 0 || edit ? (
                                    <Controller
                                        control={control}
                                        name='instructions'
                                        render={({ field, fieldState }) => (
                                            <Editor
                                                id='form_data_description'
                                                placeholder={t('common:summary')}
                                                value={field.value}
                                                disabled={id > 0 && !edit}
                                                onChange={(e) => setValue('instructions', e)}
                                                errorMessage={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                ) : (
                                    <div dangerouslySetInnerHTML={HTML(getValues('instructions'))} />
                                )}
                            </div>
                        </div>

                        {id > 0 && (
                            <div className='mt-4 flex flex-column gap-3'>
                                <div className='flex align-items-center gap-3'>
                                    <FaUserGroup />
                                    <p className='text-900 font-semibold'>Nhận xét về lớp học</p>
                                </div>

                                <div className='flex gap-3'>
                                    <Avatar
                                        icon='pi pi-user'
                                        className='bg-primary text-white border-circle mt-1'
                                        size='normal'
                                    />

                                    <InputTextarea
                                        autoResize={true}
                                        rows={1}
                                        className='border-round-3xl flex-1 text-sm'
                                        placeholder='Thêm nhận xét trong lớp học'
                                    />

                                    <Button icon='pi pi-send' className='w-2rem h-2rem mt-1' rounded={true} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='w-25rem'>
                <div className='flex flex-column gap-4'>
                    <div className='p-4 bg-white shadow-2 border-round'>
                        <div className='flex align-items-center gap-2 mb-3'>
                            <p className='text-xl font-semibold flex-1'>Tài liệu đi kèm</p>
                        </div>

                        <InputFile
                            id='form_data_files'
                            folder='test_cua_son_2/'
                            fileClassName='col-12'
                            value={getValues('files')}
                            disabled={id > 0 && !edit}
                            multiple={true}
                            hasDefault={false}
                            onChange={({ file, files }) => {
                                if (files) {
                                    setValue('files', files);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ExercisePage;
