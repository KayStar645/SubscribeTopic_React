import { API, AUTH_TOKEN } from '@assets/configs';
import { request } from '@assets/helpers';
import useCookies from '@assets/hooks/useCookies';
import { AuthType, PointParamType, PointType, TeacherType } from '@assets/interface';
import { Loader } from '@resources/components/UI';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
import { JobPageContext } from '../group/[id]/page';
import { toast } from 'react-toastify';

interface TeacherResult {
    teacher: TeacherType;
    score: number;
    studentId: number;
}

const ResultTab = () => {
    const [teacherResult, setTeacherResult] = useState<TeacherResult[]>([]);
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);
    const { topic, active } = useContext(JobPageContext);

    const pointQuery = useQuery<PointType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['points', 'list'],
        enabled: active === 'point',
        queryFn: async () => {
            const response = await request.get<PointType[]>(API.admin.custom.point.by_thesis, {
                params: {
                    thesisId: topic?.id,
                } as PointParamType,
            });

            return response.data.data || [];
        },
    });

    const pointMutate = useMutation({
        mutationFn: (data: { scores: number; studentJoinId: number }) => {
            return request.post(API.admin.point, data);
        },
    });

    const onSave = (scores: number, studentJoinId: number) => {
        pointMutate.mutate(
            {
                scores,
                studentJoinId,
            },
            {
                onSuccess: () => {
                    pointQuery.refetch();
                    toast.success('Đã cập nhập điểm của sinh viên');
                },
            },
        );
    };

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
            <Loader show={pointQuery.isFetching || pointMutate.isPending} />

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
                        body={() =>
                            field.teacher.id === auth?.customer.Id ? (
                                <InputText
                                    className='text-center w-8rem'
                                    defaultValue={field.score.toString()}
                                    keyfilter={'num'}
                                    min={0}
                                    max={10}
                                    onBlur={(e) => onSave(parseFloat(e.currentTarget.value), field.studentId)}
                                />
                            ) : (
                                <p className='text-center'>{field.score}</p>
                            )
                        }
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
                    body={(data) => <p className='text-center'>{data.averageScore}</p>}
                />
            </DataTable>
        </div>
    );
};

export default ResultTab;
