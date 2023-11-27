import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { TopicParamType, TopicType } from '@assets/interface';
import { ResponseType } from '@assets/types/request';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const useGetTopic = (id: string | number) => {
    const thesisDetailQuery = useQuery<TopicType | null, AxiosError<ResponseType>>({
        queryKey: ['thesis_detail'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const params: TopicParamType = {
                id,
                isAllDetail: true,
            };

            const response = await request.get<TopicType>(API.admin.detail.topic, { params });

            return response.data.data;
        },
    });
};
