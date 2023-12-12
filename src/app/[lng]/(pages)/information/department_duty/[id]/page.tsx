'use client';

import { API, MODULE, ROUTES } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { DutyType, DepartmentType, TeacherType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, Editor, InputDate, InputFile, InputNumber, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const defaultValues: DutyType = {
    id: 0,
    name: '',
    departmentId: 0,
    files: [],
    timeEnd: new Date(),
    timeStart: new Date(),
    numberOfThesis: 1,
    teacherId: 0,
    type: 'D',
    content: '',
};

const schema = (t: TFunction) =>
    yup.object({
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
        type: yup.string().oneOf(['F', 'D']),
    });

const DepartmentDutyForm = ({ params }: PageProps) => {
    const { lng, id } = params;
    const { t } = useTranslation(lng);
    const router = useRouter();

    const { control, handleSubmit, setValue, reset, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<DutyType>,
        defaultValues,
    });

    const departmentDutyDetailQuery = useQuery<DutyType | null, AxiosError<ResponseType>>({
        queryKey: ['departmentDuty_detail'],
        refetchOnWindowFocus: false,
        enabled: id != 0,
        queryFn: async () => {
            const response = await request.get<DutyType>(`${API.admin.detail.duty}?id=${id}`);

            return response.data.data;
        },
    });

    const departmentDutyMutation = useMutation<any, AxiosError<ResponseType>, DutyType | null>({
        mutationFn: async (data) => {
            return id == '0'
                ? request.post<DutyType>(API.admin.duty, {
                      ...data,
                      files: data?.files?.map((t) => t.path),
                  })
                : request.update<DutyType>(API.admin.duty, {
                      ...data,
                      files: data?.files?.map((t) => t.path),
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

    const onSubmit = (data: DutyType) => {
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

                <div className='col-12'>
                    <InputFile
                        id='form_data_file'
                        label='File đi kèm'
                        accept='*'
                        hasDefault={false}
                        multiple={true}
                        folder={`Department_${MODULE.duty}/${id}/`}
                        onChange={({ files }) => {
                            if (files) {
                                setValue('files', files);
                            }
                        }}
                    />
                </div>

                <div className='col-12'>
                    <Editor
                        id='form_data_content'
                        label='Nội dung'
                        placeholder='Nội dung'
                        value={getValues('content')}
                        onChange={(e) => {
                            setValue('content', e);
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
