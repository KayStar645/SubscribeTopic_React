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
    show?: (data?: MajorType) => void;
    close?: () => void;
}

interface MajorFormType extends LanguageType {
    title: string;
    onSuccess?: (data: MajorType) => void;
}

const MajorForm = forwardRef<MajorFormRefType, MajorFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const schema = yup.object({
        id: yup.string(),
        internalCode: yup.string().required(
            t('validation:required', {
                attribute: t('common:code_of', { obj: t('module:major') }).toLowerCase(),
            }),
        ),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:major') }).toLowerCase(),
            }),
        ),
    });
    const { setValue, control, handleSubmit, reset } = useForm({
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
        mutationFn: (data: MajorType) => {
            return data.id === '0' ? request.post(API.admin.major, data) : request.update(API.admin.major, data);
        },
    });
    const industryOptions: OptionType[] =
        _.map(industryQuery.data, (t) => ({ label: t.name, value: t.id, code: t.id })) || [];

    const show = (data?: MajorType) => {
        setVisible(true);

        if (data) {
            setValue('id', data.id);
            setValue('internalCode', data.internalCode);
            setValue('name', data.name);
            setValue('industryId', data.industryId);
        }

        industryQuery.refetch();
    };

    const close = () => {
        setVisible(false);
    };

    const onSubmit = (data: MajorType) => {
        majorMutation.mutate(data, {
            onSuccess: (response) => {
                toast.success(t('request:update_success'));
                close();
                reset();
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
                <Controller
                    name='internalCode'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_internal_code'
                            value={field.value}
                            label={t('code_of', { obj: t('module:major').toLowerCase() })}
                            placeholder={t('code_of', { obj: t('module:major').toLowerCase() })}
                            errorMessage={fieldState.error?.message}
                            onChange={(e) => field.onChange(e.target.value)}
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
                            label={t('name_of', { obj: t('module:major').toLowerCase() })}
                            placeholder={t('name_of', { obj: t('module:major').toLowerCase() })}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='industryId'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Dropdown
                            id='form_data_industry_id'
                            options={industryOptions}
                            value={field.value}
                            label={t('module:field.major.industry')}
                            placeholder={t('module:field.major.industry')}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

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
