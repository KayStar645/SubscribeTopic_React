import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { RegistrationPeriodType, StudentJoinType, StudentType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown } from '@resources/components/form';
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

interface StudentJoinFormRefType {
    show?: (data?: StudentJoinType) => void;
    close?: () => void;
}

interface StudentJoinFormType extends LanguageType {
    title: string;
    onSuccess?: (data: StudentJoinType) => void;
}

const defaultValues: StudentJoinType = {
    id: '0',
    studentId: '',
    registrationPeriodId: '',
};

const schema = (t: TFunction) =>
    yup.object({
        studentId: yup.string().required(
            t('validation:required', {
                attribute: t('module:field.student_join.student').toLowerCase(),
            }),
        ),
        registrationPeriodId: yup.string().required(
            t('validation:required', {
                attribute: t('module:field.student_join.registration_period').toLowerCase(),
            }),
        ),
    });

const StudentJoinForm = forwardRef<StudentJoinFormRefType, StudentJoinFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<StudentJoinType>,
        defaultValues,
    });

    const studentJoinMutation = useMutation<any, AxiosError<ResponseType>, StudentJoinType>({
        mutationFn: (data) => {
            return data.id == '0'
                ? request.post(API.admin.student_join, data)
                : request.update(API.admin.student_join, data);
        },
    });

    const studentQuery = useQuery<StudentType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['student_join_students', 'list'],
        queryFn: async () => {
            const response = await request.get<StudentType[]>(API.admin.student);

            return response.data.data || [];
        },
        onError: (err) => {
            toast.error(err.response?.data.messages?.[0] || err.message);
        },
    });

    const registrationPeriodQuery = useQuery<RegistrationPeriodType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['student_join_registration_periods', 'list'],
        queryFn: async () => {
            const response = await request.get(API.admin.registration_period);

            return response.data.data || [];
        },
        onError: (err) => {
            toast.error(err.response?.data.messages?.[0] || err.message);
        },
    });

    const show = (data?: StudentJoinType) => {
        setVisible(true);

        if (data) {
            reset(data);
        }

        studentQuery.refetch();
        registrationPeriodQuery.refetch();
    };

    const close = () => {
        setVisible(false);
        reset();
    };

    const onSubmit = (data: StudentJoinType) => {
        studentJoinMutation.mutate(data, {
            onSuccess: (response) => {
                toast.success(t('request:update_success'));
                close();
                onSuccess?.(response.data);
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
            <Loader
                show={studentJoinMutation.isLoading || studentQuery.isLoading || registrationPeriodQuery.isLoading}
            />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='studentId'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Dropdown
                            id='form_data_student_id'
                            options={studentQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                            value={field.value}
                            label={t('module:field.student_join.student')}
                            placeholder={t('module:field.student_join.student')}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='registrationPeriodId'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Dropdown
                            id='form_data_registration_id'
                            options={registrationPeriodQuery.data?.map((t) => ({
                                label: `Năm học ${t.schoolYear} _ ${t.semester} _ Đợt ${t.phase}`,
                                value: t.id,
                            }))}
                            value={field.value}
                            label={t('module:field.student_join.registration_period')}
                            placeholder={t('module:field.student_join.registration_period')}
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

StudentJoinForm.displayName = 'StudentJoin Form';

export default StudentJoinForm;
export type { StudentJoinFormRefType };
