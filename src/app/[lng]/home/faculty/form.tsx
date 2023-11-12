import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { FacultyType, TeacherType } from '@assets/interface';
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

interface FacultyFormRefType {
    show?: (data?: FacultyType) => void;
    close?: () => void;
}

interface FacultyFormType extends LanguageType {
    title: string;
    onSuccess?: (data: FacultyType) => void;
}

const defaultValues: FacultyType = {
    id: '0',
    internalCode: '',
    name: '',
    phoneNumber: '',
    address: '',
    email: '',
    dean_TeacherId: '',
};

const schema = (t: TFunction) =>
    yup.object({
        internalCode: yup.string().required(
            t('validation:required', {
                attribute: t('common:code_of', { obj: t('module:faculty') }).toLowerCase(),
            }),
        ),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:faculty') }).toLowerCase(),
            }),
        ),
        phoneNumber: yup.string().length(
            10,
            t('validation:size.string', {
                attribute: t('phone_number').toLowerCase(),
                size: 10,
            }),
        ),
    });

const FacultyForm = forwardRef<FacultyFormRefType, FacultyFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);

    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<FacultyType>,
        defaultValues,
    });

    const teacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        queryKey: ['faculty_teachers'],
        enabled: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<TeacherType[]>(API.admin.teacher);

            return response.data.data || [];
        },
        onError: (err) => {
            toast.error(err.response?.data.messages?.[0] || err.message);
        },
    });

    const facultyMutation = useMutation<any, AxiosError<ResponseType>, FacultyType>({
        mutationFn: (data) => {
            return data.id == '0' ? request.post(API.admin.faculty, data) : request.update(API.admin.faculty, data);
        },
    });

    const show = (data?: FacultyType) => {
        setVisible(true);

        teacherQuery.refetch();

        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
    };

    const onSubmit = (data: FacultyType) => {
        facultyMutation.mutate(data, {
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
            onHide={close}
        >
            <Loader show={facultyMutation.isLoading || teacherQuery.isLoading} />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='internalCode'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_internal_code'
                            value={field.value}
                            label={t('common:code_of', { obj: t('module:faculty').toLowerCase() })}
                            placeholder={t('common:code_of', { obj: t('module:faculty').toLowerCase() })}
                            errorMessage={fieldState.error?.message}
                            required={true}
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
                            required={true}
                            label={t('common:name_of', { obj: t('module:faculty').toLowerCase() })}
                            placeholder={t('common:name_of', { obj: t('module:faculty').toLowerCase() })}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

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
                    name='address'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_address'
                            value={field.value}
                            label={t('address')}
                            placeholder={t('address')}
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

                {getValues('id') != '0' && (
                    <Controller
                        name='dean_TeacherId'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_teacher_id'
                                options={teacherQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                value={field.value}
                                label={t('module:field.faculty.dean')}
                                placeholder={t('module:field.faculty.dean')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                )}

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

FacultyForm.displayName = 'Faculty Form';

export default FacultyForm;
export type { FacultyFormRefType };
