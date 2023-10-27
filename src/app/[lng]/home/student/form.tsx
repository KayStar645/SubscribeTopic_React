import { API } from '@assets/configs';
import { genders } from '@assets/configs/general';
import { request } from '@assets/helpers';
import { StudentType } from '@assets/interface';
import { OptionType } from '@assets/types/common';
import { LanguageType } from '@assets/types/lang';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { Dropdown, InputDate, InputText, RadioList } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Calendar } from 'primereact/calendar';

interface StudentFormRefType {
    show?: (data?: StudentType) => void;
    close?: () => void;
}

interface StudentFormType extends LanguageType {
    title: string;
    onSuccess?: (faculty: StudentType) => void;
}

const defaultValues: StudentType = {
    id: '',
    internalCode: '',
    name: '',
    dateOfBirth: null,
    gender: '',
    class: '',
    phoneNumber: '',
    email: '',
    majorId: '',
};

const StudentForm = forwardRef<StudentFormRefType, StudentFormType>(({ title, lng, onSuccess }, ref) => {
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
        dateOfBirth: yup
            .date()
            .typeError(t('validation:date', { attribute: t('date_of_birth').toLowerCase() }))
            .test((value) => moment().diff(value, 'years') >= 16),
        gender: yup.string().required().oneOf(['Nam', 'Nữ', 'Khác']),
        class: yup.string().required().max(10),
        phoneNumber: yup.string().length(10),
    });
    const { setValue, control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema) as Resolver<StudentType>,
        defaultValues,
    });
    const majorQuery = useQuery({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['student_majors'],
        queryFn: async () => {
            const responseData: StudentType[] = (await request.get(API.admin.major)).data.data;

            return responseData || [];
        },
    });
    const studentMutation = useMutation<AxiosResponse, AxiosError<any, any>, StudentType>({
        mutationFn: (data: StudentType) => {
            if (data.dateOfBirth) {
                data.dateOfBirth = new Date(moment(data.dateOfBirth).format('YYYY-MM-DD'));
            }

            return data.id == '0' ? request.post(API.admin.student, data) : request.update(API.admin.student, data);
        },
    });
    const majorOptions: OptionType[] =
        _.map(majorQuery.data, (t) => ({ label: t.name, value: t.id, code: t.id })) || [];

    const show = (data?: StudentType) => {
        setVisible(true);

        if (data) {
            reset(data);
        }

        majorQuery.refetch();
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
    };

    const onSubmit = (data: StudentType) => {
        studentMutation.mutate(data, {
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
            style={{ width: '90vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={() => {
                close();
            }}
        >
            <Loader show={studentMutation.isLoading} />

            <form className='mt-2 flex gap-3' onSubmit={handleSubmit(onSubmit)}>
                <div className='col-6 flex flex-column gap-3'>
                    <Controller
                        name='internalCode'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_internal_code'
                                value={field.value}
                                label={t('code_of', { obj: t('module:student') })}
                                placeholder={t('code_of', { obj: t('module:student') })}
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
                                label={t('name_of', { obj: t('module:student') })}
                                placeholder={t('name_of', { obj: t('module:student') })}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='class'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_class'
                                value={field.value}
                                label={t('module:field.student.class')}
                                placeholder={t('module:field.student.class')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='majorId'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_major_id'
                                options={majorOptions}
                                value={field.value}
                                label={t('module:field.student.major')}
                                placeholder={t('module:field.student.major')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-6 flex flex-column gap-3'>
                    <Controller
                        name='phoneNumber'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_phone_number'
                                value={field.value}
                                label={t('phone_number')}
                                placeholder={t('phone_number')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='email'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_email'
                                value={field.value}
                                label={t('email')}
                                placeholder={t('email')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='dateOfBirth'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputDate
                                id='form_data_date_of_birth'
                                value={field.value}
                                label={t('date_of_birth')}
                                placeholder={t('date_of_birth')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='gender'
                        control={control}
                        render={({ field, fieldState }) => (
                            <RadioList
                                value={field.value}
                                label={t('gender')}
                                options={genders}
                                onChange={field.onChange}
                                errorMessage={fieldState.error?.message}
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
                            close();
                        }}
                    />
                    <Button label={t('save')} icon='pi pi-save' />
                </div>
            </form>
        </Dialog>
    );
});

StudentForm.displayName = 'Student Form';

export default StudentForm;
export type { StudentFormRefType };
