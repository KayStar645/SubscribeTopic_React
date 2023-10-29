'use client';

import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { NotificationType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Editor, InputText } from '@resources/components/form';
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
    image: '',
};

const schema = (t: TFunction) =>
    yup.object({
        name: yup.string().required(
            t('validation:required', {
                attribute: t('name_of', { obj: t('module:notification') }).toLowerCase(),
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

    const { control, handleSubmit, setValue, reset } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<NotificationType>,
        defaultValues,
    });

    const notificationDetailQuery = useQuery<NotificationType | null, AxiosError<ResponseType>>({
        queryKey: ['notification_detail'],
        refetchOnWindowFocus: false,
        enabled: false,
        queryFn: async () => {
            const response = await request.get<NotificationType>(`${API.admin.detail.notification}?id=${id}`);

            return response.data.data;
        },
        onSuccess(data) {
            if (data) {
                reset(data);
            }
        },
        onError: (err) => {
            toast.error(err.response?.data.messages?.[0] || err.message);
        },
    });

    const notificationMutation = useMutation<any, AxiosError<ResponseType>, NotificationType | null>({
        mutationFn: async (data) => {
            return id == '0'
                ? request.post<NotificationType>(API.admin.notification, data)
                : request.update<NotificationType>(API.admin.notification, data);
        },
    });

    const onSubmit = (data: NotificationType) => {
        notificationMutation.mutate(data, {
            onSuccess: () => {
                toast.success(t('request:update_success'));
                router.back();
            },
            onError: (err) => {
                toast.error(err.response?.data.messages?.[0] || err.message);
            },
        });
    };

    useEffect(() => {
        if (id != '0') {
            notificationDetailQuery.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <div className='overflow-auto pb-8'>
            <Loader show={notificationMutation.isLoading || notificationDetailQuery.isFetching} />

            <form className='p-3 flex flex-column gap-3 bg-white border-round-xl ' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='name'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_name'
                            value={field.value}
                            label={t('name_of', { obj: t('module:notification').toLowerCase() })}
                            placeholder={t('name_of', { obj: t('module:notification').toLowerCase() })}
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
                            label={t('describe')}
                            placeholder={t('describe')}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='image'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_image'
                            value={field.value}
                            label={t('image')}
                            placeholder={t('image')}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='content'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Editor
                            label={t('content')}
                            value={field.value}
                            onChange={(data) => setValue(field.name, data)}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />

                <div
                    className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white px-6 h-4rem shadow-8'
                    style={{ zIndex: 1000 }}
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
