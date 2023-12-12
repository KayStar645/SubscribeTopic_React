'use client';

import { PageProps } from '@assets/types/UI';
import { OptionType } from '@assets/types/common';
import { classNames } from 'primereact/utils';
import { createContext, useMemo, useState } from 'react';
import JobInfo from '../tab/Info';
import JobReport from '../tab/Report';

interface ExercisePageContextProps {
    id: number;
    lng: string;
    topicId: number;
}

const ExercisePageContext = createContext<ExercisePageContextProps>({
    id: 0,
    lng: '',
    topicId: 0,
});

const ExercisePage = ({ params, searchParams }: PageProps) => {
    const { id, lng } = params;
    const { topicId } = searchParams;
    const [activeTab, setActiveTab] = useState<string>('info');

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

    const value: ExercisePageContextProps = {
        id,
        lng,
        topicId,
    };

    return (
        <ExercisePageContext.Provider value={value}>
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

            <div className='mt-3'>
                {activeTab === 'info' && <JobInfo />}
                {activeTab === 'exercise' && <JobReport />}
            </div>
        </ExercisePageContext.Provider>
    );
};

export default ExercisePage;
export { ExercisePageContext };
