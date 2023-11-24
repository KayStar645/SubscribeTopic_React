import { API } from '@assets/configs';
import { SEMESTER } from '@assets/configs/general';
import { request } from '@assets/helpers';
import { DepartmentType, RegistrationPeriodType } from '@assets/interface';
import { FacultyDutyType } from '@assets/interface/FacultyDuty';
import { LanguageType } from '@assets/types/lang';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, InputDate, RadioList } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Card } from 'primereact/card';
import { Editor, InputRange, InputText } from '@resources/components/form';
import { MultiSelect } from '@resources/components/form/MultiSelect';
import { useQuery } from '@tanstack/react-query';

interface FacultyDutyFormRefType {
    show?: (data?: FacultyDutyType) => void;
    close?: () => void;
}

interface FacultyDutyFormType extends LanguageType {
    title: string;
    onSuccess?: (data: FacultyDutyType) => void;
}

const defaultValues: FacultyDutyType = {
    id: '0',
    facultyId: '0',
    departmentId: 0,
    numberOfThesis: '0',
    timeStart: null,
    timeEnd: null,
    image: '',
    file: '',
};

const schema = (t: TFunction) =>
    yup.object({
        semester: yup.string(),
        timeStart: yup.date(),
        timeEnd: yup.date(),
    });

const FacultyDutyForm = forwardRef<FacultyDutyFormRefType, FacultyDutyFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<FacultyDutyType>,
        defaultValues,
    });

    const facultyDutyMutation = useMutation<any, AxiosError<ResponseType>, FacultyDutyType>({
        mutationFn: (data) => {
            return data.id == '0'
                ? request.post(API.admin.faculty_duty, data)
                : request.update(API.admin.faculty_duty, data);
        },
    });

    const departmentQuery = useQuery<DepartmentType[], AxiosError<ResponseType>>({
        queryKey: ['departments', 'list'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<DepartmentType[]>(API.admin.department);

            return response.data.data || [];
        },
    });

    const show = (data?: FacultyDutyType) => {
        setVisible(true);

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

    const onSubmit = (data: FacultyDutyType) => {
        facultyDutyMutation.mutate(data, {
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
            <Loader show={facultyDutyMutation.isLoading} />

            <form className='mt-2 flex gap-3' onSubmit={handleSubmit(onSubmit)}>
                <div className='col-6 flex flex-column gap-3'>
                    <Controller
                        name='internalCode'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_internal_code'
                                value={field.value}
                                label={t('common:code_of', { obj: t('module:faculty_duty').toLowerCase() })}
                                placeholder={t('common:code_of', { obj: t('module:faculty_duty').toLowerCase() })}
                                errorMessage={fieldState.error?.message}
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
                                label={t('common:name_of', { obj: t('module:faculty_duty').toLowerCase() })}
                                placeholder={t('common:name_of', { obj: t('module:faculty_duty').toLowerCase() })}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
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
                </div>

                <div className='col-6 flex flex-column gap-3'>
                    <Controller
                        control={control}
                        name='departmentId'
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_departmentId'
                                options={departmentQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                value={field.value}
                                label={t('module:field.faculty_duty.department')}
                                placeholder={t('module:field.faculty_duty.department')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='numberOfThesis'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_numberOfThesis'
                                value={field.value}
                                label={t('module:field.faculty_duty.numberOfThesis')}
                                placeholder={t('module:field.faculty_duty.numberOfThesis')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='image'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_image'
                                value={field.value}
                                label={t('image')}
                                placeholder={t('image')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name='file'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_file'
                                value={field.value}
                                label={t('file')}
                                placeholder={t('file')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
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

FacultyDutyForm.displayName = 'FacultyDuty Form';

export default FacultyDutyForm;
export type { FacultyDutyFormRefType };
