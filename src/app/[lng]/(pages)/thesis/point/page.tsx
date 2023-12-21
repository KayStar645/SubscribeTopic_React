'use client';

import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { PointType } from '@assets/interface';
import { Loader } from '@resources/components/UI';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const PointPage = () => {
    const pointQuery = useQuery<PointType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['points', 'list'],
        queryFn: async () => {
            const response = await request.get<PointType[]>(API.admin.custom.point.by_faculty);

            return response.data.data || [];
        },
    });

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

                <Column
                    alignHeader='center'
                    headerStyle={{
                        background: 'var(--primary-color)',
                        color: 'var(--surface-a)',
                        whiteSpace: 'nowrap',
                    }}
                    header='Điểm GVHD'
                    body={(data: PointType) => (
                        <p className='text-center'>{data.instructionScore! > 0 ? data.instructionScore : '-'}</p>
                    )}
                />

                <Column
                    alignHeader='center'
                    headerStyle={{
                        background: 'var(--primary-color)',
                        color: 'var(--surface-a)',
                        whiteSpace: 'nowrap',
                    }}
                    header='Điểm GVPB'
                    body={(data: PointType) => (
                        <p className='text-center'>{data.viewScore! > 0 ? data.viewScore : '-'}</p>
                    )}
                />

                <Column
                    alignHeader='center'
                    headerStyle={{
                        background: 'var(--primary-color)',
                        color: 'var(--surface-a)',
                        whiteSpace: 'nowrap',
                    }}
                    header='Điểm HĐ'
                    body={(data: PointType) => (
                        <p className='text-center'>{data.councilScore! > 0 ? data.councilScore : '-'}</p>
                    )}
                />

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
