import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { IndustryType, MajorType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
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

const defaultValues: MajorType = {
    id: '0',
    internalCode: '',
    name: '',
    industryId: '',
};

const schema = (t: TFunction) =>
    yup.object({
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

const MajorForm = forwardRef<MajorFormRefType, MajorFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<MajorType>,
        defaultValues,
    });

    const industryQuery = useQuery<IndustryType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['major_industries'],
        queryFn: async () => {
            const response = await request.get<IndustryType[]>(API.admin.industry);

            return response.data.data || [];
        },
    });

    const majorMutation = useMutation<any, AxiosError<ResponseType>, MajorType>({
        mutationFn: (data) => {
            return data.id == '0' ? request.post(API.admin.major, data) : request.update(API.admin.major, data);
        },
    });

    const show = (data?: MajorType) => {
        setVisible(true);

        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }

        industryQuery.refetch();
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
    };

    const onSubmit = (data: MajorType) => {
        majorMutation.mutate(data, {
            onSuccess: (response) => {
                close();
                onSuccess?.(response.data);
                toast.success(t('request:update_success'));
            },
            onError: (err) => {
                toast.error(err.response?.data.messages?.[0] || err.message);
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
            <Loader show={majorMutation.isPending || industryQuery.isLoading} />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='internalCode'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_internal_code'
                            value={field.value}
                            label={t('common:code_of', { obj: t('module:major').toLowerCase() })}
                            placeholder={t('common:code_of', { obj: t('module:major').toLowerCase() })}
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
                            label={t('common:name_of', { obj: t('module:major').toLowerCase() })}
                            placeholder={t('common:name_of', { obj: t('module:major').toLowerCase() })}
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
                            options={industryQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
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
