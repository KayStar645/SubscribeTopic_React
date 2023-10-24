import { API, FACULTY_TOKEN } from '@assets/configs';
import { request } from '@assets/helpers';
import { DepartmentType, FacultyParamType, FacultyType } from '@assets/interface';
import { OptionType } from '@assets/types/common';
import { LanguageType } from '@assets/types/lang';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { Dropdown, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import * as yup from 'yup';

interface DepartmentFormRefType {
    show?: (formData?: DepartmentType) => void;
    close?: () => void;
}

interface DepartmentFormType extends LanguageType {
    title: string;
    onSuccess?: (faculty: DepartmentType) => void;
}

const DepartmentForm = forwardRef<DepartmentFormRefType, DepartmentFormType>(({ title, lng, onSuccess }, ref) => {
    const queryClient = useQueryClient();
    const toastRef = useRef<Toast>(null);
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const schema = yup.object({
        id: yup.string(),
        internalCode: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:code_of', { obj: t('module:department') }).toLowerCase(),
                }),
            )
            .max(50),
        name: yup
            .string()
            .required(
                t('validation:required', {
                    attribute: t('common:name_of', { obj: t('module:department') }).toLowerCase(),
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
        resolver: yupResolver(schema) as Resolver<DepartmentType>,
        defaultValues: {
            id: '0',
            internalCode: '',
            name: '',
            phoneNumber: '',
            address: '',
            email: '',
            facultyId: '',
        },
    });
    const departmentMutation = useMutation<AxiosResponse, AxiosError<any, any>, DepartmentType>({
        mutationFn: (department: DepartmentType) => {
            const faculty: FacultyType = JSON.parse(getCookie(FACULTY_TOKEN)!);

            department.facultyId = faculty.id;

            return department.id === '0'
                ? request.post(API.admin.department, department)
                : request.update(API.admin.department, department);
        },
    });

    const show = (formData?: DepartmentType) => {
        setVisible(true);

        if (formData) {
            setValue('id', formData.id);
            setValue('internalCode', formData.internalCode);
            setValue('name', formData.name);
            setValue('phoneNumber', formData.phoneNumber);
            setValue('address', formData.address);
            setValue('email', formData.email);
            setValue('facultyId', formData.facultyId);
        }

        queryClient.refetchQueries({ queryKey: ['faculty_faculty'] });
    };

    const close = () => {
        setVisible(false);
    };

    const onSubmit = (formData: DepartmentType) => {
        departmentMutation.mutate(formData, {
            onSuccess: (response) => {
                toastRef.current?.show({
                    severity: 'success',
                    summary: t('notification'),
                    detail: t('request:update_success'),
                });
                close();
                onSuccess?.(response.data);
            },
            onError: (error) => {
                toastRef.current?.show({
                    severity: 'error',
                    summary: t('notification'),
                    detail: error.response?.data?.messages[0] || error.message,
                });
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
            <Toast ref={toastRef} />
            <Loader show={departmentMutation.isLoading} />
            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('code_of', { obj: t('module:department') })}</p>
                    <Controller
                        name='internalCode'
                        control={control}
                        render={({ field, fieldState, formState }) => (
                            <InputText
                                id='form_data_internal_code'
                                value={field.value}
                                placeholder={t('code_of', { obj: t('module:department') })}
                                errorMessage={fieldState.error?.message}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                </div>

                <div className='flex flex-column gap-2'>
                    <p className='font-semibold'>{t('name_of', { obj: t('module:department') })}</p>
                    <Controller
                        name='name'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_name'
                                value={field.value}
                                placeholder={t('name_of', { obj: t('module:department') })}
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

DepartmentForm.displayName = 'Department Form';

export default DepartmentForm;
export type { DepartmentFormRefType };
