'use client';

import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { ThesisType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { InputRange, InputText, InputTextArea } from '@resources/components/form';
import { MultiSelect } from '@resources/components/form/MultiSelect';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const defaultValues: ThesisType = {
    id: '0',
    internalCode: '',
    name: '',
    summary: '',
};

const schema = (t: TFunction) =>
    yup.object({
        internalCode: yup.string().required(),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:thesis') }).toLowerCase(),
            }),
        ),
        summary: yup.string().required(
            t('validation:required', {
                attribute: t('common:summary').toLowerCase(),
            }),
        ),
    });

const ThesisForm = ({ params }: PageProps) => {
    const { lng, id } = params;
    const { t } = useTranslation(lng);
    const router = useRouter();

    const { control, handleSubmit, setValue, reset } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<ThesisType>,
        defaultValues,
    });

    const thesisDetailQuery = useQuery<ThesisType | null, AxiosError<ResponseType>>({
        queryKey: ['thesis_detail'],
        refetchOnWindowFocus: false,
        enabled: id !== '0',
        queryFn: async () => {
            const response = await request.get<ThesisType>(`${API.admin.detail.thesis}?id=${id}`);

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
        <div className='overflow-auto pb-8'>
            <Loader show={thesisMutation.isLoading || thesisDetailQuery.isFetching} />

            <form className='p-3 bg-white border-round-xl ' onSubmit={handleSubmit(onSubmit)}>
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
                                <InputTextArea
                                    id='form_data_summary'
                                    value={field.value}
                                    label={t('common:summary')}
                                    placeholder={t('common:summary')}
                                    errorMessage={fieldState.error?.message}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <InputRange
                            max={10}
                            label={t('module:field.thesis.quantity')}
                            minPlaceHolder={t('common:min')}
                            maxPlaceHolder={t('common:max')}
                        />
                    </div>

                    <div className='col-5 flex flex-column gap-3'>
                        {/* <MultiSelect label={t('module:field.thesis.major')} />

                        <MultiSelect label={t('module:field.thesis.instruction')} />

                        <MultiSelect label={t('module:field.thesis.review')} /> */}
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

export default ThesisForm;
