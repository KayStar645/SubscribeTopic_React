'use client';

import { PageProps } from '@assets/types/UI';
import { OptionType } from '@assets/types/common';
import { useTranslation } from '@resources/i18n';
import { TFunction, t as defaultT } from 'i18next';
import { classNames } from 'primereact/utils';
import { createContext, useMemo, useState } from 'react';
import NewsTab from '../../tab/NewsTab';
import ExerciseTab from '../../tab/ExerciseTab';
import MemberTab from '../../tab/MemberTab';
import { useQuery } from '@tanstack/react-query';
import { API } from '@assets/configs';
import { TopicType, TopicParamType, JobType, JobParamType } from '@assets/interface';
import { AxiosError } from 'axios';
import { request } from '@assets/helpers';
import { Loader } from '@resources/components/UI';
import ResultTab from '../../tab/Result';

type JobPageContextType = {
    t: TFunction;
    lng: string;
    topic?: TopicType | null;
    jobs?: JobType[];
    active: string;
};

const JobPageContext = createContext<JobPageContextType>({
    t: defaultT,
    lng: 'vi',
    topic: null,
    jobs: [],
    active: 'news',
});

const JobPage = ({ params }: PageProps) => {
    const { lng, id } = params;
    const { t } = useTranslation(lng);
    const [activeTab, setActiveTab] = useState<string>('news');

    const topicDetail = useQuery<TopicType | null, AxiosError<ResponseType>>({
        queryKey: ['thesis_detail'],
        refetchOnWindowFocus: false,
        enabled: id != '0',
        queryFn: async () => {
            const params: TopicParamType = {
                id,
                isAllDetail: true,
            };

            const response = await request.get<TopicType>(API.admin.detail.topic, { params });

            return response.data.data;
        },
    });

    const jobDetail = useQuery<JobType[], AxiosError<ResponseType>>({
        queryKey: ['job_detail'],
        refetchOnWindowFocus: false,
        enabled: topicDetail.isSuccess,
        queryFn: async () => {
            const params: JobParamType = {
                thesisId: id,
                isAllDetail: true,
            };

            const response = await request.get<JobType[]>(API.admin.job, { params });

            return response.data.data || [];
        },
    });

    const TABS: OptionType[] = useMemo(
        () => [
            {
                value: 'news',
                label: t('module:field.job.news'),
            },
            {
                value: 'exercise',
                label: t('module:field.job.exercise'),
            },
            {
                value: 'member',
                label: t('module:field.job.member'),
            },
            {
                value: 'point',
                label: 'Điểm / Kết quả',
            },
        ],
        [t],
    );

    const value: JobPageContextType = {
        t,
        lng,
        topic: topicDetail.data,
        jobs: jobDetail.data,
        active: activeTab,
    };

    return (
        <JobPageContext.Provider value={value}>
            <Loader show={topicDetail.isFetching || jobDetail.isFetching} />

            <div className='flex align-items-center border-bottom-2 border-200 bg-white border-round overflow-hidden shadow-1'>
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

            <div
                className='mt-3'
                style={{
                    maxWidth: 1000,
                    margin: '0 auto',
                }}
            >
                {activeTab === 'news' && <NewsTab />}
                {activeTab === 'exercise' && <ExerciseTab />}
                {activeTab === 'member' && <MemberTab />}
                {activeTab === 'point' && <ResultTab />}
            </div>
        </JobPageContext.Provider>
    );
};

export default JobPage;
export { JobPageContext };
