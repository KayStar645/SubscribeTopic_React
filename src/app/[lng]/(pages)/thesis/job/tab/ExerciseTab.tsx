import { Button } from 'primereact/button';
import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { useContext } from 'react';
import { JobPageContext } from '../group/[id]/page';
import moment from 'moment';
import { HTML } from '@assets/helpers/string';
import { JobType } from '@assets/interface';
import Link from 'next/link';
import { language } from '@assets/helpers';
import { ROUTES } from '@assets/configs';

const ExerciseTab = () => {
    const { jobs, topic, lng } = useContext(JobPageContext);

    const ExerciseItemHeader = (options: PanelHeaderTemplateOptions, job: JobType) => {
        return (
            <div
                className={classNames(
                    'flex align-items-center justify-content-between gap-3 p-3 cursor-pointer bg-white border-bottom-1 border-300 border-round-top p-ripple',
                    {
                        'border-round-bottom': options.collapsed,
                    },
                )}
                onClick={options.onTogglerClick}
            >
                <div className='flex align-items-center gap-3'>
                    <Button icon='pi pi-book' rounded={true} className='w-2rem h-2rem' />

                    <p className='font-semibold text-sm text-900'>{job.name}</p>
                </div>

                <p className='text-sm text-700'>Đến hạn vào {moment(job.due).format('DD MMM')}</p>

                <Ripple />
            </div>
        );
    };

    return (
        <div className='flex flex-column pt-4 gap-4'>
            {jobs &&
                jobs.length > 0 &&
                jobs.map((job) => (
                    <Panel
                        key={job.id}
                        headerTemplate={(options) => ExerciseItemHeader(options, job)}
                        toggleable={true}
                        collapsed={true}
                        className='shadow-1 border-1 border-300 border-round overflow-hidden'
                    >
                        <div className='p-3 pb-4'>
                            <div className='flex align-items-center justify-content-between pb-3'>
                                <p className='text-sm text-500 font-semibold'>
                                    Đã đăng vào {moment(job.lastModifiedDate).format('DD MMM')}
                                </p>

                                {/* <p className='text-sm text-500 font-semibold'>Đã nộp</p> */}
                            </div>

                            <div dangerouslySetInnerHTML={HTML(job.instructions)} />
                        </div>

                        <div className='flex align-items-center justify-content-between gap-3 cursor-pointer bg-white border-top-1 border-300 p-3'>
                            <Link
                                href={`${language.addPrefixLanguage(lng, ROUTES.thesis.job_for_topic)}/${
                                    job.id
                                }?topicId=${topic?.id}`}
                                className='p-ripple hover:bg-blue-50 hover:underline border-round'
                            >
                                <p className='text-blue-600 font-semibold'>Xem hướng dẫn</p>
                                <Ripple />
                            </Link>
                        </div>
                    </Panel>
                ))}
        </div>
    );
};

export default ExerciseTab;
