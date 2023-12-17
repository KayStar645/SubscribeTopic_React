'use client';

import { API } from '@assets/configs';
import { date, request } from '@assets/helpers';
import { ScheduleParamType, ScheduleType } from '@assets/interface';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
    add,
    compareAsc,
    differenceInHours,
    differenceInMinutes,
    endOfWeek,
    format,
    getDay,
    max,
    min,
    set,
    startOfWeek,
    sub,
} from 'date-fns';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Loader } from '@resources/components/UI';
import ScheduleForm, { ScheduleFormRefType } from './form';
import moment from 'moment';

const SchedulePage = () => {
    const dateRefs = useRef<HTMLDivElement[] | null[]>([]);
    const [curr, setCurr] = useState(date.CURR_DATE);
    const [show, setShow] = useState(false);
    const [tempSchedules, setTempSchedules] = useState<ScheduleType[]>([]);
    const [schedules, setSchedules] = useState<ScheduleType[]>([]);
    const [selected, setSelected] = useState<ScheduleType>();
    const formRef = useRef<ScheduleFormRefType>(null);

    const { data, isFetching, refetch } = useQuery<ScheduleType[], AxiosError>({
        queryKey: ['schedules', 'list', curr],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get(API.admin.schedule, {
                params: {
                    isGetThesis: true,
                    filters: `timeStart>=${format(startOfWeek(curr), 'yyyy-MM-dd')},timeStart<=${format(
                        endOfWeek(curr),
                        'yyyy-MM-dd',
                    )}`,
                } as ScheduleParamType,
            });

            return response.data.data || [];
        },
    });

    useEffect(() => {
        if (data) {
            setSchedules(
                data.map((t) => ({
                    ...t,
                    timeEnd: new Date(t.timeEnd!),
                    timeStart: new Date(t.timeStart!),
                })),
            );

            setTempSchedules(
                data.map((t) => {
                    const timeEnd = moment(t.timeEnd!)
                        .set({
                            date: curr.getDate(),
                            month: curr.getMonth(),
                            year: curr.getFullYear(),
                        })
                        .toDate();

                    const timeStart = moment(t.timeStart!)
                        .set({
                            date: curr.getDate(),
                            month: curr.getMonth(),
                            year: curr.getFullYear(),
                        })
                        .toDate();

                    return {
                        ...t,
                        timeEnd,
                        timeStart,
                    };
                }),
            );
        }
    }, [curr, data]);

    const minStart = useMemo(() => {
        return moment(min(tempSchedules.map((t) => t.timeStart!)))
            .set({
                minute: 0,
            })
            .toDate();
    }, [tempSchedules]);

    const maxEnd = useMemo(() => {
        return max(tempSchedules.map((t) => t.timeEnd!));
    }, [tempSchedules]);

    const timeLines: (string | undefined)[] = useMemo(() => {
        let result: (string | undefined)[] = [];

        const date1 = set(curr, {
            hours: maxEnd.getHours(),
            minutes: maxEnd.getMinutes(),
        });

        const date2 = set(curr, {
            hours: minStart.getHours(),
            minutes: minStart.getMinutes(),
        });

        const hourStart = compareAsc(date1, date2) === 1 ? date2.getHours() : date1.getHours();
        const hourEnd = compareAsc(date1, date2) === 1 ? date1.getHours() : date2.getHours();

        for (let hour = hourStart; hour <= hourEnd; hour++) {
            const stringHour = hour.toString().padStart(2, '0');

            result.push(`${stringHour}:00`);

            for (let j = 15; j <= 60; j += 15) {
                result.push(undefined);
            }
        }

        return result;
    }, [curr, maxEnd, minStart]);

    const CalendarItem = ({ item }: { item: ScheduleType }) => {
        const index = getDay(item.timeStart!) > 0 ? getDay(item.timeStart!) - 1 : 6;
        const parent = dateRefs.current[index]!;

        if (!parent) {
            return;
        }

        const diffHoursWithMinStart = item.timeStart?.getHours()! - minStart.getHours();
        const diffMinutesWithMinStart = item.timeStart?.getMinutes()! - minStart.getMinutes();

        // bonus size
        const bonusHeight =
            differenceInHours(item.timeEnd!, item.timeStart!) > 1 ? item.timeStart?.getMinutes()! + 22.4 : 22.4;

        const bonusTop =
            diffHoursWithMinStart * 60 +
            diffHoursWithMinStart * 22.4 +
            (diffMinutesWithMinStart > 1 ? diffMinutesWithMinStart + 22.4 : 4);

        // size
        const height = differenceInMinutes(item.timeEnd!, item.timeStart!) + bonusHeight;
        const left = parent?.offsetLeft + 4;
        const top = parent?.offsetHeight + bonusTop;
        const width = parent?.offsetWidth - 8;

        //style
        const background = item.type === 'W' ? 'bg-blue-600' : 'bg-green-600';

        return (
            <>
                <div
                    style={{ height, left, top, width }}
                    className={classNames(
                        'absolute border-round p-1 overflow-hidden text-white flex flex-column gap-2',
                        background,
                    )}
                >
                    <p className='flex align-items-center justify-content-between'>
                        {format(item.timeStart!, 'HH:mm')} - {format(item.timeEnd!, 'HH:mm')}
                        <Button
                            icon='pi pi-window-maximize'
                            className='w-2rem h-2rem'
                            rounded={true}
                            severity='secondary'
                            onClick={() => {
                                setSelected(item);
                                formRef.current?.show?.(item);
                            }}
                        />
                    </p>
                    <p>{item.thesis?.name}</p>
                    <p>{item.location}</p>
                </div>
            </>
        );
    };

    useEffect(() => {
        setShow(true);
    }, []);

    return (
        <Card title='Lịch phản biện' subTitle='Lịch phản biện diễn ra trong tuần'>
            <div className='flex flex-column gap-3 relative border-round-xl overflow-hidden'>
                <Loader show={isFetching} />

                <div className='flex align-items-center justify-content-between'>
                    <div className='flex align-items-center gap-3'>
                        <Button
                            icon='pi pi-chevron-left'
                            rounded={true}
                            size='small'
                            onClick={() => {
                                setCurr(
                                    sub(curr, {
                                        days: 7,
                                    }),
                                );
                            }}
                        />
                        <Calendar
                            locale='vi'
                            hideOnDateTimeSelect={true}
                            value={curr}
                            hourFormat='24'
                            dateFormat='dd/mm/yy'
                            showButtonBar={true}
                            onChange={(e) => {
                                if (e.target.value) setCurr(e.target.value);
                            }}
                            inputClassName='w-7rem'
                        />
                        <Button
                            icon='pi pi-chevron-right'
                            rounded={true}
                            size='small'
                            onClick={() => {
                                setCurr(
                                    add(curr, {
                                        days: 7,
                                    }),
                                );
                            }}
                        />
                    </div>

                    <Button
                        label='Thêm mới'
                        size='small'
                        onClick={() => {
                            formRef.current?.show?.();
                        }}
                    />
                </div>

                <div className='overflow-auto border-round' style={{ margin: '0 auto' }}>
                    <div className='flex w-fit align-items-center relative'>
                        <div className='bg-primary text-center border-right-1 border-400 h-3rem w-4rem'></div>

                        {date.DATES_IN_WEEK(curr).map((_date, index) => (
                            <div
                                key={_date.toString()}
                                ref={(ref) => (dateRefs.current[index] = ref)}
                                className={classNames(
                                    'bg-primary text-center border-400 h-3rem w-12rem flex align-items-center justify-content-center',
                                    {
                                        'border-right-1': index < 6,
                                    },
                                )}
                            >
                                {format(_date, 'dd/MM/yyyy')}
                            </div>
                        ))}

                        {show &&
                            dateRefs.current.length > 0 &&
                            schedules &&
                            schedules.length > 0 &&
                            schedules?.map((item) => <CalendarItem item={item} key={item.timeStart!.toString()} />)}
                    </div>
                    <div className='bg-white'>
                        {timeLines.length > 0 ? (
                            timeLines.map((timeLine, index) => (
                                <div
                                    key={Math.random().toString()}
                                    className='flex w-fit align-items-center justify-content-between'
                                >
                                    <div
                                        className={classNames('bg-primary w-4rem border-400 text-center', {
                                            'border-top-1 ': !!timeLine,
                                            'border-right-1': index < 6,
                                        })}
                                        style={{
                                            height: timeLine ? 22.4 : 15,
                                        }}
                                    >
                                        {timeLine}
                                    </div>

                                    <div
                                        className={classNames('w-12rem border-right-1 border-400', {
                                            'text-white': timeLine,
                                        })}
                                        style={{
                                            height: timeLine ? 22.4 : 15,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {timeLine ? '.' : null}
                                    </div>

                                    <div
                                        className={classNames('w-12rem border-right-1 border-400', {
                                            'text-white': timeLine,
                                        })}
                                        style={{
                                            height: timeLine ? 22.4 : 15,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {timeLine ? '.' : null}
                                    </div>
                                    <div
                                        className={classNames('w-12rem border-right-1 border-400', {
                                            'text-white': timeLine,
                                        })}
                                        style={{
                                            height: timeLine ? 22.4 : 15,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {timeLine ? '.' : null}
                                    </div>
                                    <div
                                        className={classNames('w-12rem border-right-1 border-400', {
                                            'text-white': timeLine,
                                        })}
                                        style={{
                                            height: timeLine ? 22.4 : 15,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {timeLine ? '.' : null}
                                    </div>
                                    <div
                                        className={classNames('w-12rem border-right-1 border-400', {
                                            'text-white': timeLine,
                                        })}
                                        style={{
                                            height: timeLine ? 22.4 : 15,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {timeLine ? '.' : null}
                                    </div>
                                    <div
                                        className={classNames('w-12rem border-right-1 border-400', {
                                            'text-white': timeLine,
                                        })}
                                        style={{
                                            height: timeLine ? 22.4 : 15,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {timeLine ? '.' : null}
                                    </div>
                                    <div
                                        className={classNames('w-12rem border-400', {
                                            'text-white': timeLine,
                                        })}
                                        style={{
                                            height: timeLine ? 22.4 : 15,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {timeLine ? '.' : null}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='py-5 font-semibold text-center'>Không có lịch nào diễn ra trong tuần</p>
                        )}
                    </div>
                </div>
            </div>

            <ScheduleForm
                lng='vi'
                title={selected?.id ? 'Cập nhập' : 'Thêm mới'}
                ref={formRef}
                onSuccess={(_data) => refetch()}
            />
        </Card>
    );
};

export default SchedulePage;
