import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { ExchangeParamType, ExchangeType } from '@assets/interface';
import { ResponseType } from '@assets/types/request';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { useContext, useState } from 'react';
import { FaUserGroup } from 'react-icons/fa6';
import { ExercisePageContext } from './[id]/page';

const Feedback = () => {
    const { id } = useContext(ExercisePageContext);
    const [content, setContent] = useState('');

    const exchangeQuery = useQuery<ExchangeType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: id > 0,
        queryKey: ['exchanges', 'list'],
        queryFn: async () => {
            const response = await request.get<ExchangeType[]>(API.admin.exchange, {
                params: {
                    removeFacultyId: true,
                    jobId: id,
                    sorts: 'LastModifiedDate',
                } as ExchangeParamType,
            });

            return response.data.data || [];
        },
    });

    const exchangeMutation = useMutation({
        mutationFn: () => {
            return request.post(API.admin.exchange, {
                content,
                jobId: id,
            });
        },
        onSuccess: () => {
            setContent('');
            exchangeQuery.refetch();
        },
    });

    return (
        <div className='bg-white border-round overflow-hidden mt-3 shadow-2 p-3 relative'>
            <div className='flex align-items-center gap-3 mb-4'>
                <FaUserGroup />
                <p className='text-900 font-semibold'>Nhận xét về công việc</p>
            </div>

            <div className='flex flex-column gap-4 max-h-25rem overflow-auto'>
                {exchangeQuery.isFetching ? (
                    <div className='flex gap-2 align-items-start'>
                        <Skeleton className='w-2rem h-2rem' shape='circle' />

                        <div className='flex flex-column gap-2'>
                            <Skeleton className='w-10rem h-1rem' />
                            <Skeleton className='w-20rem h-2rem' />
                            <Skeleton className='w-10rem h-1rem' />
                        </div>
                    </div>
                ) : (
                    exchangeQuery.data &&
                    exchangeQuery.data?.length > 0 &&
                    exchangeQuery.data?.map((feedback) => (
                        <div key={feedback.id} className='flex gap-2 align-items-start'>
                            <Avatar icon='pi pi-user' className='bg-primary text-white border-circle' />

                            <div className='flex flex-column gap-2'>
                                {feedback?.teacher?.name || feedback?.student?.name}
                                <Chip label={feedback?.content} className='bg-gray-200' />
                                <p className='text-xs'>
                                    {moment(feedback?.lastModifiedDate).format('DD/MM/YYYY HH:mm')}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className='mt-4 flex flex-column gap-3'>
                <div className='flex gap-3'>
                    <Avatar icon='pi pi-user' className='bg-primary text-white border-circle mt-1' size='normal' />

                    <InputTextarea
                        autoResize={true}
                        rows={2}
                        className='border-round-3xl flex-1 text-sm'
                        placeholder='Thêm nhận xét cho công việc'
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {content && (
                        <Button
                            icon='pi pi-send'
                            className='w-2rem h-2rem mt-1'
                            rounded={true}
                            onClick={(e) => {
                                e.preventDefault();

                                exchangeMutation.mutate();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
