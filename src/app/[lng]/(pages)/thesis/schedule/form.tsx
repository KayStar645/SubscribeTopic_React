import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { ScheduleType, TeacherType, TopicType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, InputDate, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface ScheduleFormRefType {
    show?: (_data?: ScheduleType) => void;
    close?: () => void;
}

interface ScheduleFormType extends LanguageType {
    title: string;
    onSuccess?: (_data: ScheduleType) => void;
}

const defaultValues: ScheduleType = {
    id: 0,
    timeStart: null,
    timeEnd: null,
    location: '',
    type: 'R',
    thesisId: 0,
};

const schema = (_t: TFunction) =>
    yup.object({
        timeStart: yup.date().required(),
        timeEnd: yup.date().required(),
    });

const ScheduleForm = forwardRef<ScheduleFormRefType, ScheduleFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const [date, setDate] = useState(new Date());

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<ScheduleType>,
        defaultValues,
    });

    const thesisQuery = useQuery<TopicType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['thesis', 'list'],
        queryFn: async () => {
            const response = await request.get<TopicType[]>(`${API.admin.custom.thesis.topic_by_teacher}`);

            return response.data.data || [];
        },
    });

    const ScheduleMutation = useMutation<any, AxiosError<ResponseType>, ScheduleType>({
        mutationFn: (data) => {
            data.timeEnd = moment(data.timeEnd)
                .set({
                    date: date.getDate(),
                })
                .format('yyyy-MM-DDTHH:mm');
            data.timeStart = moment(data.timeStart)
                .set({
                    date: date.getDate(),
                })
                .format('yyyy-MM-DDTHH:mm');

            return data.id == '0' ? request.post(API.admin.schedule, data) : request.update(API.admin.schedule, data);
        },
    });

    const show = (data?: ScheduleType) => {
        setVisible(true);

        thesisQuery.refetch();

        if (data) {
            reset(data);
            setDate(data.timeStart!);
        } else {
            reset(defaultValues);
        }
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
    };

    const onSubmit = (data: ScheduleType) => {
        ScheduleMutation.mutate(data, {
            onSuccess: (response) => {
                close();
                onSuccess?.(response.data);
                toast.success(t('request:update_success'));
            },
            onError: (err) => {
                toast.error(err.response?.data.messages?.[0] || err.message);
            },
        });
    };

    useImperativeHandle(ref, () => ({
        show,
        close,
    }));

    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '50vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            <Loader show={ScheduleMutation.isPending || thesisQuery.isFetching} />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name='thesisId'
                    render={({ field, fieldState }) => (
                        <Dropdown
                            id='form_data_teacher_id'
                            options={thesisQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                            value={field.value}
                            label='Đề tài'
                            placeholder='Đề tài'
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <InputDate
                    id='form_data_time_end'
                    value={date}
                    label='Ngày'
                    placeholder='Ngày'
                    onChange={(e) => {
                        setDate(e.value);
                    }}
                />

                <div className='flex gap-3'>
                    <Controller
                        name='timeStart'
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputDate
                                id='form_data_time_start'
                                value={field.value}
                                label={t('common:time_start')}
                                blockClassName='flex-1'
                                placeholder={t('common:time_start')}
                                timeOnly={true}
                                showButtonBar={false}
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
                                value={field.value}
                                label={t('common:time_end')}
                                blockClassName='flex-1'
                                placeholder={t('common:time_end')}
                                timeOnly={true}
                                showButtonBar={false}
                                errorMessage={fieldState.error?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <Controller
                    control={control}
                    name='type'
                    render={({ field, fieldState }) => (
                        <Dropdown
                            id='form_data_teacher_id'
                            options={[
                                {
                                    label: 'Lịch hằng tuần',
                                    value: 'W',
                                },
                                {
                                    label: 'Lịch phản biện',
                                    value: 'R',
                                },
                            ]}
                            value={field.value}
                            label='Loại lịch'
                            placeholder='Loại lịch'
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='location'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_address'
                            value={field.value}
                            label={t('address')}
                            placeholder={t('address')}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <div className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white p-4'>
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
        </Dialog>
    );
});

ScheduleForm.displayName = 'Schedule Form';

export default ScheduleForm;
export type { ScheduleFormRefType };
