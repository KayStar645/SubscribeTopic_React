'use client';

import { API, ROUTES } from '@assets/configs';
import { request } from '@assets/helpers';
import { PageProps } from '@assets/types/UI';
import { MetaType, ParamType } from '@assets/types/request';
import Loader from '@resources/components/UI/Loader';
import { Dropdown } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useState } from 'react';

const FacultyPage = ({ params: { lng } }: PageProps) => {
	const { t } = useTranslation(lng);
	const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
	const { data, isLoading, isError } = useQuery({
		queryKey: ['faculties', 'list'],
		queryFn: async () => {
			const params: ParamType = {
				page: meta.currentPage,
				pageSize: meta.pageSize,
			};

			const response = await request.get(`${API.admin.faculty_list}`, params);

			setMeta({
				currentPage: response.data.currentPage,
				hasNextPage: response.data.hasNextPage,
				hasPreviousPage: response.data.hasPreviousPage,
				pageSize: response.data.pageSize,
				totalCount: response.data.totalCount,
				totalPages: response.data.totalPages,
				messages: response.data.messages,
			});

			return response.data.data || [];
		},
	});

	const onPageChange = (e: PaginatorPageChangeEvent) => {
		setMeta((prev) => ({ ...prev, pageSize: e.rows, currentPage: e.first + 1 }));
	};

	return (
		<div>
			<div className='flex align-items-center justify-content-between'>
				<InputText placeholder={`${t('search')}...`} />

				<Button
					label='Tạo mới'
					icon='pi pi-plus'
				/>
			</div>
			<div className='border-round-xl overflow-hidden mt-3'>
				<DataTable
					value={data || []}
					rowHover={true}
					stripedRows={true}
					emptyMessage={t('list_empty')}
				>
					<Column
						headerClassName='bg-primary text-white font-semibold'
						header={t('action')}
						body={
							<div className='flex align-items-center gap-3'>
								<i className='pi pi-pencil hover:text-primary cursor-pointer'></i>
								<i className='pi pi-trash hover:text-primary cursor-pointer'></i>
							</div>
						}
					></Column>
					<Column
						headerClassName='bg-primary text-white font-semibold'
						field='internalCode'
						header={t('code_of', { obj: t('module:faculty') })}
					></Column>
					<Column
						headerClassName='bg-primary text-white font-semibold'
						field='name'
						header={t('name_of', { obj: t('module:faculty') })}
					></Column>
					<Column
						headerClassName='bg-primary text-white font-semibold'
						field='address'
						header={t('address')}
					></Column>
					<Column
						headerClassName='bg-primary text-white font-semibold'
						field='phoneNumber'
						header={t('phone_number')}
					></Column>
					<Column
						headerClassName='bg-primary text-white font-semibold'
						field='email'
						header={t('email')}
					></Column>
				</DataTable>

				<div className='flex align-items-center justify-content-between bg-white px-3 py-2'>
					<Dropdown
						id='date_created_filter'
						value='DateCreated'
						options={[
							{ label: `${t('filter_date_created_down')}`, value: '-DateCreated' },
							{ label: `${t('filter_date_created_up')}`, value: 'DateCreated' },
						]}
					/>

					<Paginator
						first={meta.currentPage - 1}
						rows={meta.pageSize}
						totalRecords={2}
						rowsPerPageOptions={[10, 20, 30]}
						onPageChange={onPageChange}
						className='border-noround p-0'
					/>
				</div>
				<Loader show={isLoading || isError} />
			</div>
		</div>
	);
};

export default FacultyPage;
