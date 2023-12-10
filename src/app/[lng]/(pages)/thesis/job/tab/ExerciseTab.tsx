import { Button } from 'primereact/button';
import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { useContext } from 'react';
import { JobPageContext } from '../group/[id]/page';
import moment from 'moment';
import { HTML } from '@assets/helpers/string';

const ExerciseTab = () => {
    const { jobs } = useContext(JobPageContext);

    const ExerciseItemHeader = (options: PanelHeaderTemplateOptions) => {
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

                    <p className='font-semibold text-sm text-900'>Bài tập đầu đời</p>
                </div>

                <p className='text-sm text-700'>Đến hạn vào 4 Thg 11</p>

                <Ripple />
            </div>
        );
    };

    return (
        <div className='flex flex-column pt-4'>
            <Panel
                headerTemplate={ExerciseItemHeader}
                toggleable={true}
                collapsed={true}
                className='shadow-1 border-1 border-300 border-round overflow-hidden'
            >
                {jobs &&
                    jobs.length > 0 &&
                    jobs.map((job) => (
                        <>
                            <div className='p-3 pb-6'>
                                <div className='flex align-items-center justify-content-between pb-3'>
                                    <p className='text-sm text-500 font-semibold'>
                                        Đã đăng vào 4 Thg 11 {moment(job.lastModifiedDate).format('DD MMM')}
                                    </p>

                                    {/* <p className='text-sm text-500 font-semibold'>Đã nộp</p> */}
                                </div>

                                <div dangerouslySetInnerHTML={HTML(job.instructions)} />
                            </div>

                            <div className='flex align-items-center justify-content-between gap-3 cursor-pointer bg-white border-top-1 border-300'>
                                <div className='p-ripple py-2 px-3 hover:bg-blue-50 border-round'>
                                    <p className='text-blue-600 font-semibold'>Xem hướng dẫn</p>
                                    <Ripple />
                                </div>
                            </div>
                        </>
                    ))}
            </Panel>
        </div>
    );
};

export default ExerciseTab;
