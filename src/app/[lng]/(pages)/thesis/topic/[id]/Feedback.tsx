import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { FeedbackParamType, FeedbackType } from '@assets/interface';
import { Loader } from '@resources/components/UI';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { InputTextarea } from 'primereact/inputtextarea';
import { useContext, useState } from 'react';
import { TopicPageContext } from './page';

const TopicFeedback = ({ showInput = true }: { showInput?: boolean }) => {
    const [value, setValue] = useState('');
    const { t, id } = useContext(TopicPageContext);

    const {
        data: feedbacks,
        isFetching,
        refetch,
    } = useQuery({
        refetchOnWindowFocus: false,
        queryKey: ['feedbacks', 'list'],
        select: (response) => response.data.data,
        queryFn: () => {
            return request.get<FeedbackType[]>(API.admin.feedback, {
                params: {
                    thesisId: id,
                    sorts: '-DateCreated',
                } as FeedbackParamType,
            });
        },
    });

    const { isPending, mutate } = useMutation({
        mutationFn: () => {
            return request.post(API.admin.feedback, {
                content: value,
                thesisId: id,
            });
        },
        onSuccess: () => {
            setValue('');
            refetch();
        },
    });

    return (
        <Card title={t?.('module:field.thesis.add_feedback')} className='relative'>
            <div className='flex flex-column gap-6'>
                <Loader show={isFetching || isPending} />

                {feedbacks && feedbacks.length > 0 && (
                    <div className='flex flex-column gap-4'>
                        {feedbacks &&
                            feedbacks?.length > 0 &&
                            feedbacks?.map((feedback) => (
                                <div key={feedback.id} className='flex gap-2 align-items-start'>
                                    <Avatar icon='pi pi-user' className='bg-primary text-white border-circle' />

                                    <div className='flex flex-column gap-2'>
                                        {feedback.commenter.name}
                                        <Chip label={feedback.content} className='bg-gray-200' />
                                        <p className='text-xs'>
                                            {moment(feedback.dateCreated).format('DD/MM/YYYY HH:MM')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {showInput && (
                    <div className='flex flex-column gap-3'>
                        <div className='flex align-items-start gap-2'>
                            <Avatar icon='pi pi-user' className='bg-primary text-white border-circle' />
                            <InputTextarea
                                autoResize
                                placeholder={t?.('module:field.thesis.add_feedback')}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                rows={5}
                                cols={30}
                                className='flex-1'
                            />
                        </div>

                        {value && (
                            <div className='flex justify-content-end'>
                                <Button
                                    icon='pi pi-send'
                                    label={t?.('common:send')}
                                    className='w-fit px-3 py-2'
                                    onClick={() => mutate()}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TopicFeedback;
