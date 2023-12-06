'use client';

import { API, MODULE, ROUTES } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { NotificationType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Editor, InputFile, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const defaultValues: NotificationType = {
    id: '0',
    name: '',
    describe: '',
    content: '',
    image: undefined,
    images: undefined,
};

const schema = (t: TFunction) =>
    yup.object({
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:notification') }).toLowerCase(),
            }),
        ),
        content: yup.string().required(
            t('validation:required', {
                attribute: t('content').toLowerCase(),
            }),
        ),
    });

const NotificationForm = ({ params }: PageProps) => {
    const { lng, id } = params;
    const { t } = useTranslation(lng);
    const router = useRouter();

    const { control, handleSubmit, setValue, reset, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<NotificationType>,
        defaultValues,
    });

    const notificationDetailQuery = useQuery<NotificationType | null, AxiosError<ResponseType>>({
        queryKey: ['notification_detail'],
        refetchOnWindowFocus: false,
        enabled: id != 0,
        queryFn: async () => {
            const response = await request.get<NotificationType>(`${API.admin.detail.notification}?id=${id}`);

            return response.data.data;
        },
    });

    useEffect(() => {
        if (notificationDetailQuery.data) {
            reset(notificationDetailQuery.data);
        }
    }, [notificationDetailQuery.data, reset]);

    const notificationMutation = useMutation<any, AxiosError<ResponseType>, NotificationType | null>({
        mutationFn: async (data) => {
            return id == '0'
                ? request.post<NotificationType>(API.admin.notification, {
                      ...data,
                      image: data?.image?.path,
                      images: data?.images?.map((t) => t.path),
                  })
                : request.update<NotificationType>(API.admin.notification, {
                      ...data,
                      image: data?.image?.path,
                      images: data?.images?.map((t) => t.path),
                  });
        },
    });

    const onSubmit = (data: NotificationType) => {
        notificationMutation.mutate(data, {
            onSuccess: () => {
                toast.success(t('request:update_success'));
                router.push(
                    language.addPrefixLanguage(
                        lng,
                        ROUTES.information.notification + '?activeItem=notification&openMenu=false&parent=information',
                    ),
                );
            },
        });
    };

    return (
        <div className='overflow-auto pb-8'>
            <Loader show={notificationMutation.isPending || notificationDetailQuery.isFetching} />

            <form className='p-3 flex flex-column gap-3 bg-white border-round-xl ' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='name'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_name'
                            value={field.value}
                            label={t('common:name_of', { obj: t('module:notification').toLowerCase() })}
                            placeholder={t('common:name_of', { obj: t('module:notification').toLowerCase() })}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='describe'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_describe'
                            value={field.value}
                            label={t('common:describe')}
                            placeholder={t('common:describe')}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='images'
                    control={control}
                    render={({ field }) => (
                        <InputFile
                            id='form_image'
                            multiple={true}
                            label={t('common:image')}
                            value={field.value}
                            defaultValue={getValues('image')}
                            accept='*'
                            folder={`${MODULE.notification}/${id}/`}
                            onChange={({ file, files }) => {
                                if (file) {
                                    setValue('image', file);
                                }

                                if (files) {
                                    setValue('images', files);
                                }
                            }}
                        />
                    )}
                />

                <Controller
                    name='content'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Editor
                            id='form_data_content'
                            label={t('common:content')}
                            value={field.value}
                            onChange={(data) => setValue(field.name, data)}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />

                <div
                    className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white px-5 h-4rem shadow-8'
                    style={{ zIndex: 500 }}
                >
                    <Button
                        size='small'
                        label={t('cancel')}
                        icon='pi pi-undo'
                        severity='secondary'
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    />
                    <Button size='small' label={t('save')} icon='pi pi-save' />
                </div>
            </form>
        </div>
    );
};

export default NotificationForm;
