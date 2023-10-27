import { API } from '@assets/configs';
import { semesters } from '@assets/configs/general';
import { request } from '@assets/helpers';
import { IndustryType, RegistrationPeriodType } from '@assets/interface';
import { OptionType } from '@assets/types/common';
import { LanguageType } from '@assets/types/lang';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { Dropdown, InputDate, InputText, RadioList } from '@resources/components/form';
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

interface RegistrationPeriodFormRefType {
    show?: (data?: RegistrationPeriodType) => void;
    close?: () => void;
}

interface RegistrationPeriodFormType extends LanguageType {
    title: string;
    onSuccess?: (data: RegistrationPeriodType) => void;
}

const defaultValues: RegistrationPeriodType = {
    id: '0',
    semester: undefined,
    timeStart: null,
    timeEnd: null,
};

const RegistrationPeriodForm = forwardRef<RegistrationPeriodFormRefType, RegistrationPeriodFormType>(
    ({ title, lng, onSuccess }, ref) => {
        const [visible, setVisible] = useState(false);
        const { t } = useTranslation(lng);
        const schema = yup.object({
            semester: yup.string(),
            timeStart: yup.date(),
            timeEnd: yup.date(),
        });
        const { control, handleSubmit, reset } = useForm({
            resolver: yupResolver(schema) as Resolver<RegistrationPeriodType>,
            defaultValues,
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
        const registrationPeriodMutation = useMutation<AxiosResponse, AxiosError<any, any>, RegistrationPeriodType>({
            mutationFn: (data: RegistrationPeriodType) => {
                return data.id == '0'
                    ? request.post(API.admin.registration_period, data)
                    : request.update(API.admin.registration_period, data);
            },
        });

        const show = (data?: RegistrationPeriodType) => {
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

        const onSubmit = (data: RegistrationPeriodType) => {
            console.log('🚀 ~ file: form.tsx:84 ~ onSubmit ~ data:', data);
            registrationPeriodMutation.mutate(data, {
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
                <Loader show={registrationPeriodMutation.isLoading} />

                <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name='semester'
                        control={control}
                        render={({ field, fieldState }) => (
                            <RadioList
                                value={field.value}
                                label={t('module:field.registration_period.semester')}
                                options={semesters}
                                onChange={field.onChange}
                                errorMessage={fieldState.error?.message}
                            />
                        )}
                    />

                    <Controller
                        name='timeStart'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputDate
                                id='form_data_time_start'
                                time={true}
                                value={field.value}
                                label={t('time_start')}
                                placeholder={t('time_start')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='timeEnd'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputDate
                                id='form_data_time_end'
                                time={true}
                                value={field.value}
                                label={t('time_end')}
                                placeholder={t('time_end')}
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
    },
);

RegistrationPeriodForm.displayName = 'RegistrationPeriod Form';

export default RegistrationPeriodForm;
export type { RegistrationPeriodFormRefType };
