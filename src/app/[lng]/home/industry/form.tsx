import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { IndustryType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface IndustryFormRefType {
    show?: (data?: IndustryType) => void;
    close?: () => void;
}

interface IndustryFormType extends LanguageType {
    title: string;
    onSuccess?: (data: IndustryType) => void;
}

const defaultValues: IndustryType = {
    id: '0',
    internalCode: '',
    name: '',
    facultyId: '',
};

const IndustryForm = forwardRef<IndustryFormRefType, IndustryFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const schema = yup.object({
        internalCode: yup.string().required(
            t('validation:required', {
                attribute: t('common:code_of', { obj: t('module:industry') }).toLowerCase(),
            }),
        ),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:industry') }).toLowerCase(),
            }),
        ),
    });
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema) as Resolver<IndustryType>,
        defaultValues,
    });
    const industryMutation = useMutation<AxiosResponse, AxiosError<any, any>, IndustryType>({
        mutationFn: (data: IndustryType) => {
            return data.id == '0' ? request.post(API.admin.industry, data) : request.update(API.admin.industry, data);
        },
    });

    const show = (data?: IndustryType) => {
        setVisible(true);

        if (data) {
            reset(data);
        }
    };

    const close = () => {
        setVisible(false);
        reset();
    };

    const onSubmit = (data: IndustryType) => {
        industryMutation.mutate(data, {
            onSuccess: (response) => {
                toast.success(t('request:update_success'));
                close();
                onSuccess?.(response.data);
            },
            onError: (error) => {
                toast.error(error.response?.data?.messages?.[0] || error.message);
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
            }}
        >
            <Loader show={industryMutation.isLoading} />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='internalCode'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_internal_code'
                            value={field.value}
                            label={t('code_of', { obj: t('module:industry').toLowerCase() })}
                            placeholder={t('code_of', { obj: t('module:industry').toLowerCase() })}
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
                            label={t('name_of', { obj: t('module:industry').toLowerCase() })}
                            placeholder={t('name_of', { obj: t('module:industry').toLowerCase() })}
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
                            close();
                        }}
                    />
                    <Button label={t('save')} icon='pi pi-save' />
                </div>
            </form>
        </Dialog>
    );
});

IndustryForm.displayName = 'Industry Form';

export default IndustryForm;
export type { IndustryFormRefType };
