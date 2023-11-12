import { API } from '@assets/configs';
import { academics, degrees as _degrees, genders, employeeTypes } from '@assets/configs/general';
import { request } from '@assets/helpers';
import { DepartmentType, TeacherType } from '@assets/interface';
import { OptionType } from '@assets/types/common';
import { LanguageType } from '@assets/types/lang';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, InputDate, InputText, RadioList } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface TeacherFormRefType {
    show?: (data?: TeacherType) => void;
    close?: () => void;
}

interface TeacherFormType extends LanguageType {
    title: string;
    onSuccess?: (faculty: TeacherType) => void;
}

const defaultValues: TeacherType = {
    id: 0,
    internalCode: '',
    name: '',
    dateOfBirth: null,
    gender: '',
    phoneNumber: '',
    email: '',
    departmentId: '',
    academicTitle: undefined,
    type: undefined,
};

const schema = (t: TFunction) =>
    yup.object({
        id: yup.string(),
        internalCode: yup.string().required(
            t('validation:required', {
                attribute: t('code_of', { obj: t('module:teacher') }).toLowerCase(),
            }),
        ),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('name_of', { obj: t('module:teacher') }).toLowerCase(),
            }),
        ),
        dateOfBirth: yup
            .date()
            .typeError(t('validation:date', { attribute: t('date_of_birth').toLowerCase() }))
            .test((value) => moment().diff(value, 'years') >= 16),
        gender: yup.string().required(),
        phoneNumber: yup.string().length(10),
        type: yup.string().required(),
    });

const TeacherForm = forwardRef<TeacherFormRefType, TeacherFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const [degrees, setDegrees] = useState<OptionType[]>([]);

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<TeacherType>,
        defaultValues,
    });

    const departmentQuery = useQuery<DepartmentType[], AxiosError<ResponseType>>({
        enabled: false,
        refetchOnWindowFocus: false,
        queryKey: ['teacher_departments'],
        queryFn: async () => {
            const response = await request.get<DepartmentType[]>(API.admin.department);

            return response.data.data || [];
        },
        onError: (err) => {
            toast.error(err.response?.data.messages?.[0] || err.message);
        },
    });

    const teacherMutation = useMutation<any, AxiosError<ResponseType>, TeacherType>({
        mutationFn: (data) => {
            if (data.dateOfBirth) {
                data.dateOfBirth = new Date(moment(data.dateOfBirth).format('YYYY-MM-DD'));
            }

            return data.id == '0' ? request.post(API.admin.teacher, data) : request.update(API.admin.teacher, data);
        },
    });

    const show = (data?: TeacherType) => {
        setVisible(true);

        if (data) {
            reset(data);
        }

        departmentQuery.refetch();
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
    };

    const onSubmit = (data: TeacherType) => {
        teacherMutation.mutate(data, {
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
            style={{ width: '90vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            <Loader show={teacherMutation.isLoading || departmentQuery.isLoading} />

            <form className='mt-2 flex gap-3' onSubmit={handleSubmit(onSubmit)}>
                <div className='col-6 flex flex-column gap-3'>
                    <Controller
                        name='internalCode'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_internal_code'
                                value={field.value}
                                label={t('code_of', { obj: t('module:teacher').toLowerCase() })}
                                placeholder={t('code_of', { obj: t('module:teacher').toLowerCase() })}
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
                                label={t('name_of', { obj: t('module:teacher').toLowerCase() })}
                                placeholder={t('name_of', { obj: t('module:teacher').toLowerCase() })}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='academicTitle'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_academic_title'
                                options={academics(t)}
                                value={field.value}
                                label={t('module:field.teacher.academic')}
                                placeholder={t('module:field.teacher.academic')}
                                emptyMessage={t('list_empty')}
                                errorMessage={fieldState.error?.message}
                                onChange={(value) => {
                                    if (value === t('info:academic.doctor')) {
                                        setDegrees(_degrees(t));
                                    } else {
                                        setDegrees([]);
                                    }

                                    field.onChange(value);
                                }}
                            />
                        )}
                    />

                    <Controller
                        name='degree'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_degree'
                                options={degrees}
                                value={field.value}
                                label={t('module:field.teacher.degree')}
                                placeholder={t('module:field.teacher.degree')}
                                emptyMessage={t('list_empty')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='departmentId'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_department_id'
                                options={departmentQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                value={field.value}
                                label={t('module:field.teacher.department')}
                                placeholder={t('module:field.teacher.department')}
                                emptyMessage={t('list_empty')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-6 flex flex-column gap-3'>
                    <Controller
                        name='type'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_type'
                                options={employeeTypes(t)}
                                value={field.value}
                                label={t('module:field.teacher.type')}
                                placeholder={t('module:field.teacher.type')}
                                emptyMessage={t('list_empty')}
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
                                options={genders(t)}
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

TeacherForm.displayName = 'Teacher Form';

export default TeacherForm;
export type { TeacherFormRefType };
