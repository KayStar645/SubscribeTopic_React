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

type JobPageContextType = {
    t: TFunction;
    lng: string;
};

const JobPageContext = createContext<JobPageContextType>({
    t: defaultT,
    lng: 'vi',
});

const JobPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const [activeTab, setActiveTab] = useState<string>('news');

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
        ],
        [t],
    );

    const value: JobPageContextType = {
        t,
        lng,
    };

    return (
        <JobPageContext.Provider value={value}>
            <div className='flex align-items-center border-bottom-2 border-200 bg-white border-round overflow-hidden'>
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
            </div>
        </JobPageContext.Provider>
    );
};

export default JobPage;
export { JobPageContext };
