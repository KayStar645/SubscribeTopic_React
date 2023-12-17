'use client';

import { API, ROUTES } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { JobParamType, JobType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { OptionType } from '@assets/types/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Control, Resolver, UseFormGetValues, UseFormSetValue, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import JobInfo from '../tab/Info';
import JobReport from '../tab/Report';
import { useTranslation } from '@resources/i18n';
import { Skeleton } from 'primereact/skeleton';
import FileInstructions from '../Exercise';
import Feedback from '../Feedback';
import { Loader } from '@resources/components/UI';

const defaultValues: JobType = {
    id: 0,
    name: '',
    instructions: '',
    due: new Date(),
    files: [],
};

const schema = (t: TFunction) =>
    yup.object({
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:job') }).toLowerCase(),
            }),
        ),
        instructions: yup.string().required(),
        due: yup.date(),
    });

interface ExercisePageContextProps {
    id: number;
    lng: string;
    topicId: number;
    edit: boolean;
    control?: Control<JobType, any>;
    job?: JobType | null;
    setValue?: UseFormSetValue<JobType>;
    getValues?: UseFormGetValues<JobType>;
}

const ExercisePageContext = createContext<ExercisePageContextProps>({
    id: 0,
    lng: '',
    topicId: 0,
    edit: false,
    control: undefined,
    job: undefined,
    setValue: undefined,
    getValues: undefined,
});

const ExercisePage = ({ params, searchParams }: PageProps) => {
    const { id, lng } = params;
    const { topicId } = searchParams;
    const [activeTab, setActiveTab] = useState<string>('info');
    const [edit, setEdit] = useState(false);
    const router = useRouter();
    const { t } = useTranslation(lng);

    const TABS: OptionType[] = useMemo(
        () => [
            {
                value: 'info',
                label: 'Hướng dẫn',
            },
            {
                value: 'exercise',
                label: 'Báo cáo',
            },
        ],
        [],
    );

    const { control, handleSubmit, reset, getValues, setValue } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<JobType>,
        defaultValues,
    });

    const jobDetail = useQuery<JobType | null, AxiosError<ResponseType>>({
        queryKey: ['job_detail', id],
        refetchOnWindowFocus: false,
        enabled: id != 0,
        queryFn: async () => {
            const params: JobParamType = {
                id,
                isAllDetail: true,
            };

            const response = await request.get<JobType>(API.admin.detail.job, { params });

            return response.data.data;
        },
    });

    const jobMutation = useMutation<any, AxiosError<ResponseType>, JobType>({
        mutationFn: async (data) => {
            data.thesisId = topicId;

            return id == 0
                ? request.post(API.admin.job, {
                      ...data,
                      files: data?.files?.map((t) => t.path),
                      due: moment(data.due).format('YYYY-MM-DDTHH:mm'),
                  })
                : request.update(API.admin.job, {
                      ...data,
                      files: data?.files?.map((t) => t.path),
                      due: moment(data.due).format('YYYY-MM-DDTHH:mm'),
                  });
        },
    });

    const onSubmit = (data: JobType) => {
        jobMutation.mutate(data, {
            onSuccess: () => {
                setEdit(false);
                router.push(language.addPrefixLanguage(lng, `${ROUTES.thesis.job_detail}/${topicId}`));
                toast.success(t('request:update_success'));
            },
        });
    };

    useEffect(() => {
        if (jobDetail.data) {
            reset(jobDetail.data);
        }
    }, [jobDetail.data, reset]);

    const value: ExercisePageContextProps = {
        id,
        lng,
        topicId,
        edit,
        control,
        setValue,
        getValues,
        job: jobDetail.data,
    };

    return (
        <ExercisePageContext.Provider value={value}>
            <form onSubmit={handleSubmit(onSubmit)} className='relative'>
                <Loader show={jobMutation.isPending} />

                <div className='flex align-items-center justify-content-between border-bottom-2 border-200 bg-white border-round overflow-hidden'>
                    <div className='flex align-items-center'>
                        {TABS.map((tab) => (
                            <div
                                key={tab.value}
                                className={classNames(
                                    'px-5 py-3 cursor-pointer hover:text-primary border-bottom-3 border-transparent font-semibold',
                                    {
                                        'text-900': tab.value != activeTab,
                                        'text-primary border-primary': tab.value === activeTab,
                                    },
                                )}
                                onClick={() => setActiveTab(tab.value?.toString()!)}
                            >
                                {tab.label}
                            </div>
                        ))}
                    </div>

                    {id > 0 ? (
                        <div className='pr-3'>
                            {edit ? (
                                <Button size='small' label='Lưu' icon='pi pi-save' />
                            ) : (
                                <Button
                                    size='small'
                                    label='Cập nhập'
                                    icon='pi pi-pencil'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setEdit(true);
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <Button icon='pi pi-save' size='small' rounded={true} tooltip='Thêm mới' />
                    )}
                </div>

                <div className='mt-3'>
                    {activeTab === 'info' && (
                        <div className='flex gap-3'>
                            <div className='flex-1'>
                                <div className='flex gap-3 bg-white p-4 border-round shadow-1'>
                                    {jobDetail.isFetching ? (
                                        <div className='flex-1 flex flex-column'>
                                            <Skeleton height='3rem' className='w-full' />

                                            <div className='flex align-items-center justify-content-between my-3'>
                                                <Skeleton height='1rem' width='15rem' />

                                                <Skeleton height='1rem' width='15rem' />
                                            </div>

                                            <Skeleton height='4rem' className='w-full' />
                                        </div>
                                    ) : (
                                        <JobInfo />
                                    )}
                                </div>

                                <Feedback />
                            </div>

                            <div className='w-25rem'>
                                <FileInstructions />
                            </div>
                        </div>
                    )}
                    {activeTab === 'exercise' && <JobReport />}
                </div>
            </form>
        </ExercisePageContext.Provider>
    );
};

export default ExercisePage;
export { ExercisePageContext };
