import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { FacultyType, TeacherType } from '@assets/interface';
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

interface FacultyFormRefType {
    show?: (data?: FacultyType) => void;
    close?: () => void;
}

interface FacultyFormType extends LanguageType {
    title: string;
    onSuccess?: (data: FacultyType) => void;
}

const FacultyForm = forwardRef<FacultyFormRefType, FacultyFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const schema = yup.object({
        id: yup.string(),
        internalCode: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:code_of', { obj: t('module:faculty') }).toLowerCase(),
                }),
            )
            .max(50),
        name: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:name_of', { obj: t('module:faculty') }).toLowerCase(),
                }),
            )
            .max(150),
        address: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:address').toLowerCase(),
                }),
            )
            .max(200),
        phoneNumber: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:phone_number').toLowerCase(),
                }),
            )
            .max(10),
        email: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:email').toLowerCase(),
                }),
            )
            .max(30),
    });
    const { setValue, control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema) as Resolver<FacultyType>,
        defaultValues: {
            id: '0',
            internalCode: '',
            name: '',
            phoneNumber: '',
            address: '',
            email: '',
            dean_TeacherId: '',
        },
    });
    const teacherQuery = useQuery({
        queryKey: ['faculty_teachers'],
        enabled: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const responseData: TeacherType[] = (await request.get(API.admin.teacher)).data.data;

            return responseData || [];
        },
    });
    const facultyMutation = useMutation<AxiosResponse, AxiosError<any, any>, FacultyType>({
        mutationFn: (faculty: FacultyType) => {
            return faculty.id === '0'
                ? request.post(API.admin.faculty, faculty)
                : request.update(API.admin.faculty, faculty);
        },
    });
    const teacherOptions: OptionType[] =
        _.map(teacherQuery.data, (t) => ({ label: t.name, value: t.id, code: t.id })) || [];

    const show = (data?: FacultyType) => {
        setVisible(true);

        teacherQuery.refetch();

        if (data) {
            setValue('id', data.id);
            setValue('internalCode', data.internalCode);
            setValue('name', data.name);
            setValue('phoneNumber', data.phoneNumber);
            setValue('address', data.address);
            setValue('email', data.email);
            setValue('dean_TeacherId', data.dean_TeacherId);
        }
    };

    const close = () => {
        setVisible(false);
    };

    const onSubmit = (data: FacultyType) => {
        facultyMutation.mutate(data, {
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
            <Loader show={facultyMutation.isLoading} />
            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('code_of', { obj: t('module:faculty') })}</p>
                    <Controller
                        name='internalCode'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_internal_code'
                                value={field.value}
                                placeholder={t('code_of', { obj: t('module:faculty') })}
                                errorMessage={fieldState.error?.message}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                </div>

                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('name_of', { obj: t('module:faculty') })}</p>
                    <Controller
                        name='name'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_name'
                                value={field.value}
                                placeholder={t('name_of', { obj: t('module:faculty') })}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('address')}</p>
                    <Controller
                        name='address'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_address'
                                value={field.value}
                                placeholder={t('address')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </div>

                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('phone_number')}</p>
                    <Controller
                        name='phoneNumber'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_phone_number'
                                value={field.value}
                                placeholder={t('phone_number')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </div>

                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('email')}</p>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_email'
                                value={field.value}
                                placeholder={t('email')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </div>

                {getValues('id') !== '0' && (
                    <div className='flex flex-column gap-2'>
                        <p className='font-semibold'>{t('module:field.faculty.dean')}</p>
                        <Controller
                            name='dean_TeacherId'
                            control={control}
                            render={({ field, fieldState }) => (
                                <Dropdown
                                    id='form_data_teacher_id'
                                    placeholder={t('module:field.faculty.dean')}
                                    options={teacherOptions}
                                    value={field.value}
                                    errorMessage={fieldState.error?.message}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                )}

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

FacultyForm.displayName = 'Faculty Form';

export default FacultyForm;
export type { FacultyFormRefType };
