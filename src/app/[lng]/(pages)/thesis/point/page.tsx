'use client';

import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { PointType, TeacherType } from '@assets/interface';
import { Loader } from '@resources/components/UI';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';

interface TeacherResult {
    teacher: TeacherType;
    score: number;
    studentId: number;
}

const PointPage = () => {
    const [teacherResult, setTeacherResult] = useState<TeacherResult[]>([]);
    const pointQuery = useQuery<PointType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['points', 'list'],
        queryFn: async () => {
            const response = await request.get<PointType[]>(API.admin.custom.point.by_faculty);

            return response.data.data || [];
        },
    });

    useEffect(() => {
        if (pointQuery.data) {
            let result: TeacherResult[] = [];

            pointQuery.data.forEach((t) => {
                result = [];

                t.scores?.map((score) => {
                    result.push({
                        teacher: score.teacher,
                        score: score.score,
                        studentId: t.studentJoinId!,
                    });
                });
            });

            setTeacherResult(result);
        }
    }, [pointQuery.data]);

    return (
        <div className='flex flex-column gap-3 bg-white border-round shadow-1 p-3'>
            <Loader show={pointQuery.isFetching} />

            <DataTable
                value={pointQuery.data}
                tableStyle={{ minWidth: '50rem' }}
                className='border-round overflow-hidden'
            >
                <Column
                    alignHeader='center'
                    headerStyle={{
                        background: 'var(--primary-color)',
                        color: 'var(--surface-a)',
                        whiteSpace: 'nowrap',
                    }}
                    header='Mã sinh viên'
                    field='studentJoin.student.internalCode'
                />
                <Column
                    alignHeader='center'
                    headerStyle={{
                        background: 'var(--primary-color)',
                        color: 'var(--surface-a)',
                        whiteSpace: 'nowrap',
                    }}
                    header='Tên sinh viên'
                    field='studentJoin.student.name'
                />

                {teacherResult.map((field) => (
                    <Column
                        key={field.teacher.id}
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={field.teacher.name}
                        body={() => <p className='text-center'>{field.score > 0 ? field.score : '-'}</p>}
                    />
                ))}

                <Column
                    alignHeader='center'
                    headerStyle={{
                        background: 'var(--primary-color)',
                        color: 'var(--surface-a)',
                        whiteSpace: 'nowrap',
                    }}
                    header='Điểm trung bình'
                    body={(data: PointType) => (
                        <p className='text-center'>{data.averageScore! > 0 ? data.averageScore : '-'}</p>
                    )}
                />
            </DataTable>
        </div>
    );
};

export default PointPage;
