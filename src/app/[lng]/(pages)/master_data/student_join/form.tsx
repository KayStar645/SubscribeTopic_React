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
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
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
    registrationPeriodId: '',
};

const schema = (t: TFunction) =>
    yup.object({
        registrationPeriodId: yup.string().required(
            t('validation:required', {
                attribute: t('module:field.student_join.registration_period').toLowerCase(),
            }),
        ),
    });

const StudentJoinForm = forwardRef<StudentJoinFormRefType, StudentJoinFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const [students, setStudents] = useState<number[]>([]);

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
    });

    const registrationPeriodQuery = useQuery<RegistrationPeriodType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['student_join_registration_periods', 'list'],
        queryFn: async () => {
            const response = await request.get(API.admin.registration_period);

            return response.data.data || [];
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
        data.studentIds = students;

        studentJoinMutation.mutate(data, {
            onSuccess: (response) => {
                toast.success(t('request:update_success'));
                close();
                onSuccess?.(response.data);
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
                show={studentJoinMutation.isPending || studentQuery.isFetching || registrationPeriodQuery.isFetching}
            />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
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
                <DataTable
                    value={studentQuery.data}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={t('list_empty')}
                >
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={t('common:action')}
                        body={(data: StudentType) => (
                            <div className='flex align-items-center justify-content-center'>
                                <Checkbox
                                    checked={!!students?.includes(data.id)}
                                    onChange={(e) => {
                                        if (e.checked) {
                                            setStudents((prev) => {
                                                let result = prev.filter((t) => t != data.id);

                                                result.push(data.id);

                                                return result;
                                            });
                                        } else {
                                            setStudents((prev) => {
                                                let result = prev.filter((t) => t != data.id);

                                                return result;
                                            });
                                        }
                                    }}
                                />
                            </div>
                        )}
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='internalCode'
                        header='Mã sinh viên'
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='name'
                        header='Tên sinh viên'
                    />
                </DataTable>

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
