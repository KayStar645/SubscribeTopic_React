import { API, AUTH_TOKEN } from '@assets/configs';
import { request } from '@assets/helpers';
import useCookies from '@assets/hooks/useCookies';
import { AuthType, PointParamType, PointType, TeacherType } from '@assets/interface';
import { Loader } from '@resources/components/UI';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { JobPageContext } from '../group/[id]/page';

interface TeacherResult {
    teacher: TeacherType;
    score: number;
    studentId: number;
}

const ResultTab = () => {
    const [teacherResult, setTeacherResult] = useState<any[]>([]);
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);
    const [teacher, setTeacher] = useState<string[]>([]);
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
            return request.update(API.admin.point, data);
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
            let result: any[] = [];
            let _teacher: string[] = [];

            pointQuery.data.forEach((t) => {
                _teacher = [];

                result.push({
                    internalCode: t.studentJoin?.student.internalCode,
                    name: t.studentJoin?.student.name,
                    avg: t.averageScore,
                    scores: t.scores?.map((score) => ({
                        teacherId: score.teacher.id,
                        score: score.score,
                        studentId: t.studentJoinId,
                    })),
                });

                t.scores?.forEach((score) => {
                    _teacher.push(score.teacher.name!);
                });
            });

            setTeacherResult(result);
            setTeacher(_teacher);
        }
    }, [pointQuery.data]);

    return (
        <div className='flex flex-column gap-3 bg-white border-round shadow-1 p-3'>
            <Loader show={pointQuery.isFetching || pointMutate.isPending} />

            <div className='border-round overflow-hidden shadow-3'>
                <table className='w-full' style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th className='border-1 border-300 p-3 bg-primary' colSpan={2}>
                                Thông tin sinh viên
                            </th>
                            {teacher.map((name) => (
                                <th className='border-1 border-300 p-3 bg-primary' key={name}>
                                    {name}
                                </th>
                            ))}
                            <th className='border-1 border-300 p-3 bg-primary'>Điểm trung bình</th>
                        </tr>
                        <tr>
                            <th className='border-1 border-300 p-3 bg-primary'>Mã sinh viên</th>
                            <th className='border-1 border-300 p-3 bg-primary'>Tên sinh viên</th>
                            {teacher.map((name) => (
                                <th className='border-1 border-300 p-3 bg-primary' key={name}>
                                    {name}
                                </th>
                            ))}
                            <th className='border-1 border-300 p-3 bg-primary'>Điểm trung bình</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teacherResult.map((result) => (
                            <tr key={result.internalCode}>
                                <td className='border-1 border-300 py-2 px-3'>{result.internalCode}</td>
                                <td className='border-1 border-300 py-2 px-3'>{result.name}</td>
                                {result?.scores?.map((field: any) => (
                                    <td className='border-1 border-300 py-2 px-3' key={field.teacherId}>
                                        {field?.teacherId === auth?.customer.Id ? (
                                            <div className='flex justify-content-center'>
                                                <InputText
                                                    className='text-center w-8rem'
                                                    defaultValue={field.score.toString()}
                                                    keyfilter={'num'}
                                                    min={0}
                                                    max={10}
                                                    onBlur={(e) =>
                                                        onSave(parseFloat(e.currentTarget.value), field.studentId)
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <p className='text-center'>{field.score > 0 ? field.score : '-'}</p>
                                        )}
                                    </td>
                                ))}
                                <td className='border-1 border-300 py-2 px-3'>
                                    <p className='text-center'>{result.avg > 0 ? result.avg : '-'}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultTab;
