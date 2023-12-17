import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { JobResultParamType, JobResultType } from '@assets/interface';
import { Loader } from '@resources/components/UI';
import { InputFile } from '@resources/components/form';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import { classNames } from 'primereact/utils';
import { useContext } from 'react';
import { ExercisePageContext } from '../[id]/page';

const JobReport = () => {
    const { id, lng, topicId } = useContext(ExercisePageContext);

    const jobQuery = useQuery<JobResultType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['job_results', 'list'],
        queryFn: async () => {
            const response = await request.get<JobResultType[]>(API.admin.job_result, {
                params: {
                    jobId: id,
                    isGetStudentBy: true,
                } as JobResultParamType,
            });

            return response.data.data || [];
        },
    });

    const Header = (options: PanelHeaderTemplateOptions, data: JobResultType) => {
        return (
            <div className={classNames(options.className, 'flex align-items-center justify-content-between gap-5')}>
                <p className='flex-1'>{data.studentBy?.name}</p>

                <p>{moment(data.lastModifiedDate).format('HH:mm DD/MM/YYYY')}</p>

                <Button
                    icon='pi pi-chevron-down'
                    className='w-2rem h-2rem'
                    severity='secondary'
                    text={true}
                    rounded={true}
                    onClick={options.onTogglerClick}
                />
            </div>
        );
    };

    return (
        <div className='flex flex-column gap-3 bg-white border-round shadow-1 p-3 relative overflow-hidden'>
            <Loader show={jobQuery.isLoading} />

            {jobQuery.data &&
                jobQuery.data.length > 0 &&
                jobQuery.data.map((job) => (
                    <Panel
                        headerTemplate={(options) => Header(options, job)}
                        collapsed={true}
                        key={job.id}
                        toggleable={true}
                    >
                        <InputFile id={Math.random.toString()} value={job.files} disabled={true} />
                    </Panel>
                ))}
        </div>
    );
};

export default JobReport;
