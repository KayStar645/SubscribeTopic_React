import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { PointType, PointParamType } from '@assets/interface';
import { Loader } from '@resources/components/UI';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const ResultTab = () => {
    const pointQuery = useQuery<PointType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['points', 'list'],
        queryFn: async () => {
            const response = await request.get<PointType[]>(API.admin.custom.point.by_thesis, {
                params: {
                    isGetThesisCurrentMe: true,
                } as PointParamType,
            });

            return response.data.data || [];
        },
    });

    return (
        <div className='flex flex-column gap-5 bg-white border-round shadow-1 p-3'>
            <Loader show={pointQuery.isFetching} />

            {pointQuery.data &&
                pointQuery.data.length > 0 &&
                pointQuery.data.map((point) => (
                    <div key={Math.random().toString()}>{point.studentJoin?.student.name}</div>
                ))}
        </div>
    );
};

export default ResultTab;
