'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { getCookie } from 'cookies-next';

const Faculty = () => {
	const { data } = useQuery({
		queryKey: ['list'],
		queryFn: async () => {
			const response = await axios.get('https://localhost:7155/api/Faculties', {
				headers: {
					accept: 'text/plain',
					Authorization: `Bearer ${getCookie('auth_token')}`,
				},
			});

			return response.data.data || [];
		},
	});

	return (
		data && (
			<DataTable
				value={data}
				tableStyle={{ minWidth: '50rem' }}
			>
				<Column
					field='internalCode'
					header='internalCode'
				></Column>
				<Column
					field='name'
					header='name'
				></Column>
				<Column
					field='address'
					header='address'
				></Column>
				<Column
					field='phoneNumber'
					header='phoneNumber'
				></Column>
				<Column
					field='email'
					header='email'
				></Column>
			</DataTable>
		)
	);
};

export default Faculty;
