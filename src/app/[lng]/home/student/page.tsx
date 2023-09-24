'use client';

import { useQuery } from '@tanstack/react-query';

const Page = () => {
	const { data, isFetching } = useQuery({
		queryKey: ['list'],
		queryFn: () => {},
	});

	return <div></div>;
};

export default Page;
