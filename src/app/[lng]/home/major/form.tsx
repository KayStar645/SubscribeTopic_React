import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { IndustryType, MajorType } from '@assets/interface';
import { OptionType } from '@assets/types/common';
import { LanguageType } from '@assets/types/lang';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { Dropdown, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface MajorFormRefType {
    show?: (formData?: MajorType) => void;
    close?: () => void;
}

interface MajorFormType extends LanguageType {
    title: string;
    onSuccess?: (faculty: MajorType) => void;
}

const MajorForm = forwardRef<MajorFormRefType, MajorFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const schema = yup.object({
        id: yup.string(),
        internalCode: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:code_of', { obj: t('module:major') }).toLowerCase(),
                }),
            )
            .max(50),
        name: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:name_of', { obj: t('module:major') }).toLowerCase(),
                }),
            )
            .max(150),
    });
    const { setValue, control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<MajorType>,
        defaultValues: {
            id: '0',
            internalCode: '',
            name: '',
            industryId: '',
        },
    });
    const industryQuery = useQuery({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['major_industry'],
        queryFn: async () => {
            const responseData: IndustryType[] = (await request.get(API.admin.industry)).data.data;

            return responseData || [];
        },
    });
    const majorMutation = useMutation<AxiosResponse, AxiosError<any, any>, MajorType>({
        mutationFn: (major: MajorType) => {
            return major.id === '0' ? request.post(API.admin.major, major) : request.update(API.admin.major, major);
        },
    });
    const industryOptions: OptionType[] =
        _.map(industryQuery.data, (t) => ({ label: t.name, value: t.id, code: t.id })) || [];

    const show = (formData?: MajorType) => {
        setVisible(true);

        if (formData) {
            setValue('id', formData.id);
            setValue('internalCode', formData.internalCode);
            setValue('name', formData.name);
            setValue('industryId', formData.industryId);
        }

        industryQuery.refetch();
    };

    const close = () => {
        setVisible(false);
    };

    const onSubmit = (formData: MajorType) => {
        majorMutation.mutate(formData, {
            onSuccess: (response) => {
                toast.success(t('request:update_success'));
                close();
                onSuccess?.(response.data);
            },
            onError: (error) => {
                toast.error(error.response?.data?.messages[0] || error.message);
            },
        });
    };

    useImperativeHandle(ref, () => ({
        show,
        close,
    }));

    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '50vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={() => {
                close();
                reset();
            }}
        >
            <Loader show={majorMutation.isLoading} />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('code_of', { obj: t('module:major') })}</p>
                    <Controller
                        name='internalCode'
                        control={control}
                        render={({ field, fieldState, formState }) => (
                            <InputText
                                id='form_data_internal_code'
                                value={field.value}
                                placeholder={t('code_of', { obj: t('module:major') })}
                                errorMessage={fieldState.error?.message}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                </div>

                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('name_of', { obj: t('module:major') })}</p>
                    <Controller
                        name='name'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_name'
                                value={field.value}
                                placeholder={t('name_of', { obj: t('module:major') })}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('module:field.major.industry')}</p>
                    <Controller
                        name='industryId'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_industry_id'
                                placeholder={t('module:field.major.industry')}
                                options={industryOptions}
                                value={field.value}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white p-4'>
                    <Button
                        label={t('cancel')}
                        icon='pi pi-undo'
                        severity='secondary'
                        onClick={(e) => {
                            e.preventDefault();
                            reset();
                            close();
                        }}
                    />
                    <Button label={t('save')} icon='pi pi-save' />
                </div>
            </form>
        </Dialog>
    );
});

MajorForm.displayName = 'Major Form';

export default MajorForm;
export type { MajorFormRefType };
