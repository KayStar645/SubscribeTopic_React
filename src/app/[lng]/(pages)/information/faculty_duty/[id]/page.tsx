'use client';

import { API, MODULE, ROUTES } from '@assets/configs';
import { PageProps } from '@assets/types/UI';
import { language, request } from '@assets/helpers';
import { DepartmentType, RegistrationPeriodType } from '@assets/interface';
import { DutyType } from '@assets/interface/Duty';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, Editor, InputDate, InputFile, InputNumber } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { InputText } from '@resources/components/form';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const defaultValues: DutyType = {
    id: 0,
    name: '',
    internalCode: '',
    content: '',
    departmentId: 0,
    numberOfThesis: 1,
    timeEnd: null,
    files: [],
};

const schema = (_t: TFunction) =>
    yup.object({
        name: yup.string().required(),
        internalCode: yup.string().required(),
        timeEnd: yup.date(),
        files: yup.array().of(yup.string()),
    });

const FacultyDutyForm = ({ params }: PageProps) => {
    const { lng, id } = params;
    const { t } = useTranslation(lng);
    const router = useRouter();

    const { control, handleSubmit, setValue, reset, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<DutyType>,
        defaultValues,
    });

    const facultyDutyDetailQuery = useQuery<DutyType | null, AxiosError<ResponseType>>({
        queryKey: ['faculty_duty'],
        refetchOnWindowFocus: false,
        enabled: id != 0,
        queryFn: async () => {
            const response = await request.get<DutyType>(`${API.admin.detail.duty}?id=${id}`);

            return response.data.data;
        },
    });

    const facultyDutyMutation = useMutation<any, AxiosError<ResponseType>, DutyType | null>({
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

    const departmentQuery = useQuery<DepartmentType[], AxiosError<ResponseType>>({
        queryKey: ['departments', 'list'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<DepartmentType[]>(API.admin.department);

            return response.data.data || [];
        },
    });

    const onSubmit = (data: DutyType) => {
        facultyDutyMutation.mutate(data, {
            onSuccess: () => {
                toast.success(t('request:update_success'));
                router.push(
                    language.addPrefixLanguage(
                        lng,
                        ROUTES.information.faculty_duty + '?activeItem=faculty_duty&openMenu=false&parent=information',
                    ),
                );
            },
            onError: (err) => {
                toast.error(err.response?.data.messages?.[0] || err.message);
            },
        });
    };

    useEffect(() => {
        if (facultyDutyDetailQuery.data) {
            reset(facultyDutyDetailQuery.data);
        }
    }, [facultyDutyDetailQuery.data, reset]);

    return (
        <div className='overflow-auto pb-8'>
            <Loader show={facultyDutyMutation.isPending || facultyDutyDetailQuery.isFetching} />

            <form className='p-3 flex flex-wrap bg-white border-round-xl ' onSubmit={handleSubmit(onSubmit)}>
                <div className='col-4'>
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
                </div>

                <div className='col-4'>
                    <Controller
                        control={control}
                        name='departmentId'
                        render={({ field, fieldState }) => (
                            <Dropdown
                                id='form_data_department_id'
                                options={departmentQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                                value={field.value}
                                label={t('module:field.faculty_duty.department')}
                                placeholder={t('module:field.faculty_duty.department')}
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
                                label={t('time_end')}
                                placeholder={t('time_end')}
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
                                id='form_data_numberOfThesis'
                                value={field.value}
                                label={t('module:field.faculty_duty.numberOfThesis')}
                                placeholder={t('module:field.faculty_duty.numberOfThesis')}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className='col-12'>
                    <InputFile
                        id='form_data_image'
                        label='File đi kèm'
                        accept='*'
                        hasDefault={false}
                        multiple={true}
                        value={getValues('files')}
                        folder={`Faculty_${MODULE.duty}/${id}`}
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
        </div>
    );
};

export default FacultyDutyForm;
