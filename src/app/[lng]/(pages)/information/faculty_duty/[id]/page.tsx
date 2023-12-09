'use client';

import { API, ROUTES } from '@assets/configs';
import { PageProps } from '@assets/types/UI';
import { language, request } from '@assets/helpers';
import { DepartmentType } from '@assets/interface';
import { FacultyDutyType } from '@assets/interface/FacultyDuty';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, InputDate, InputFile } from '@resources/components/form';
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

const defaultValues: FacultyDutyType = {
    id: '0',
    facultyId: '0',
    departmentId: 0,
    numberOfThesis: '0',
    timeStart: null,
    timeEnd: null,
    images: [],
    image: '',
    file: '',
};

const schema = (t: TFunction) =>
    yup.object({
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:faculty_duty') }).toLowerCase(),
            }),
        ),
        numberOfThesis: yup.number().required(
            t('validation:required', {
                attribute: t('numberOfThesis').toLowerCase(),
            }),
        ),
        timeEnd: yup.date().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:faculty_duty') }).toLowerCase(),
            }),
        ),
    });

const FacultyDutyForm = ({ params }: PageProps) => {
    const { lng, id } = params;
    const { t } = useTranslation(lng);
    const router = useRouter();

    const { control, handleSubmit, setValue, reset } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<FacultyDutyType>,
        defaultValues,
    });

    const facultyDutyDetailQuery = useQuery<FacultyDutyType | null, AxiosError<ResponseType>>({
        queryKey: ['faculty_duty'],
        refetchOnWindowFocus: false,
        enabled: id != 0,
        queryFn: async () => {
            const response = await request.get<FacultyDutyType>(`${API.admin.detail.faculty_duty}?id=${id}`);

            return response.data.data;
        },
    });

    useEffect(() => {
        if (facultyDutyDetailQuery.data) {
            reset(facultyDutyDetailQuery.data);
        }
    }, [facultyDutyDetailQuery.data, reset]);

    const facultyDutyMutation = useMutation<any, AxiosError<ResponseType>, FacultyDutyType | null>({
        mutationFn: async (data) => {
            return id == '0'
                ? request.post<FacultyDutyType>(API.admin.faculty_duty, data)
                : request.update<FacultyDutyType>(API.admin.faculty_duty, data);
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

    const onSubmit = (data: FacultyDutyType) => {
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

    return (
        <div className='overflow-auto pb-8'>
            <Loader show={facultyDutyMutation.isPending || facultyDutyDetailQuery.isFetching} />

            <form className='p-3 flex flex-column gap-3 bg-white border-round-xl ' onSubmit={handleSubmit(onSubmit)}>
                
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
                        render={() => (
                            <InputFile
                                id='form_image'
                                multiple={true}
                                label={t('common:image')}
                                accept='*'
                                folder={`test_cua_son_2/`}
                                onChange={({ file, files }) => {
                                    if (file) {
                                        setValue('image', file?.path);
                                    }

                                    if (files) {
                                        setValue(
                                            'images',
                                            files.map((t) => t.path),
                                        );
                                    }
                                }}
                            />
                        )}
                    />
                

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
