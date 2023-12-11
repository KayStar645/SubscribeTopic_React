'use client';

import { API, MODULE, ROUTES } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { DepartmentDutyType, DepartmentType, TeacherType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, InputDate, InputFile, InputNumber, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const defaultValues: DepartmentDutyType = {
    id: '0',
    internalCode: '',
    name: '',
    departmentId: 0,
    file: undefined,
    image: undefined,
    timeEnd: new Date(),
    timeStart: new Date(),
    numberOfThesis: 1,
    teacherId: 0,
};

const schema = (t: TFunction) =>
    yup.object({
        internalCode: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:department_duty') }).toLowerCase(),
            }),
        ),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:department_duty') }).toLowerCase(),
            }),
        ),
        departmentId: yup.number().required(),
        timeStart: yup.date(),
        timeEnd: yup.date(),
        numberOfThesis: yup.number().min(1),
        teacherId: yup.number().required(),
    });

const DepartmentDutyForm = ({ params }: PageProps) => {
    const { lng, id } = params;
    const { t } = useTranslation(lng);
    const router = useRouter();

    const { control, handleSubmit, setValue, reset, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<DepartmentDutyType>,
        defaultValues,
    });

    const departmentDutyDetailQuery = useQuery<DepartmentDutyType | null, AxiosError<ResponseType>>({
        queryKey: ['departmentDuty_detail'],
        refetchOnWindowFocus: false,
        enabled: id != 0,
        queryFn: async () => {
            const response = await request.get<DepartmentDutyType>(`${API.admin.detail.department_duy}?id=${id}`);

            return response.data.data;
        },
    });

    const departmentDutyMutation = useMutation<any, AxiosError<ResponseType>, DepartmentDutyType | null>({
        mutationFn: async (data) => {
            return id == '0'
                ? request.post<DepartmentDutyType>(API.admin.department_duty, {
                      ...data,
                      image: data?.image?.path,
                      file: data?.file?.path,
                  })
                : request.update<DepartmentDutyType>(API.admin.department_duty, {
                      ...data,
                      image: data?.image?.path,
                      file: data?.file?.path,
                  });
        },
    });

    const teacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        queryKey: ['teachers'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<TeacherType[]>(`${API.admin.teacher}`);

            return response.data.data || [];
        },
    });

    const departmentQuery = useQuery<DepartmentType[] | [], AxiosError<ResponseType>>({
        queryKey: ['departments'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<DepartmentType[]>(`${API.admin.department}`);

            return response.data.data || [];
        },
    });

    const onSubmit = (data: DepartmentDutyType) => {
        departmentDutyMutation.mutate(data, {
            onSuccess: () => {
                toast.success(t('request:update_success'));
                router.push(
                    language.addPrefixLanguage(
                        lng,
                        ROUTES.information.department_duty +
                            '?activeItem=departmentDuty&openMenu=false&parent=information',
                    ),
                );
            },
        });
    };

    useEffect(() => {
        if (departmentDutyDetailQuery.data) {
            reset(departmentDutyDetailQuery.data);
        }
    }, [departmentDutyDetailQuery.data, reset]);

    return (
        <div className='overflow-auto pb-8'>
            <Loader show={departmentDutyMutation.isPending || departmentDutyDetailQuery.isFetching} />

            <form className='p-3 flex flex-wrap bg-white border-round-xl ' onSubmit={handleSubmit(onSubmit)}>
                <div className='col-4'>
                    <Controller
                        name='internalCode'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_internal_code'
                                value={field.value}
                                label={t('common:code_of', { obj: t('module:department_duty').toLowerCase() })}
                                placeholder={t('common:code_of', { obj: t('module:department_duty').toLowerCase() })}
                                required={true}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-4'>
                    <Controller
                        name='name'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                id='form_data_name'
                                value={field.value}
                                label={t('common:name_of', { obj: t('module:department_duty').toLowerCase() })}
                                placeholder={t('common:name_of', { obj: t('module:department_duty').toLowerCase() })}
                                required={true}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-4'>
                    <Controller
                        name='numberOfThesis'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputNumber
                                id='form_data_number_of_thesis'
                                label='Số lượng đề tài'
                                min={1}
                                value={field.value}
                                required={true}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-4'>
                    <Controller
                        name='teacherId'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_teacher_id'
                                options={teacherQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                value={field.value}
                                label={t('module:teacher')}
                                placeholder={t('module:teacher')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-4'>
                    <Controller
                        name='departmentId'
                        control={control}
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_department_id'
                                options={departmentQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                value={field.value}
                                label='Bộ môn'
                                placeholder='Bộ môn'
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-4'>
                    <Controller
                        name='timeStart'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputDate
                                id='form_data_time_start'
                                value={field.value}
                                label={t('common:time_start')}
                                placeholder={t('common:time_start')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-4'>
                    <Controller
                        name='timeEnd'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputDate
                                id='form_data_time_end'
                                value={field.value}
                                label={t('common:time_end')}
                                placeholder={t('common:time_end')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-4'>
                    <InputFile
                        id='form_data_image'
                        label={t('common:image')}
                        defaultValue={getValues('image')}
                        fileClassName=''
                        accept='image/*'
                        // folder={`${MODULE.departmentDuty}/${id}/`}
                        folder={`test_cua_son_2/`}
                        onChange={({ file }) => {
                            if (file) {
                                setValue('image', file);
                            }
                        }}
                    />
                </div>

                <div className='col-4'>
                    <InputFile
                        id='form_data_file'
                        label={t('common:file')}
                        defaultValue={getValues('file')}
                        fileClassName=''
                        accept='*'
                        // folder={`${MODULE.departmentDuty}/${id}/`}
                        folder={`test_cua_son_2/`}
                        onChange={({ file }) => {
                            if (file) {
                                setValue('file', file);
                            }
                        }}
                    />
                </div>

                <div
                    className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white px-5 h-4rem shadow-8'
                    style={{ zIndex: 500 }}
                >
                    <Button
                        size='small'
                        label={t('cancel')}
                        icon='pi pi-undo'
                        severity='secondary'
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    />
                    <Button size='small' label={t('save')} icon='pi pi-save' />
                </div>
            </form>
        </div>
    );
};

export default DepartmentDutyForm;
