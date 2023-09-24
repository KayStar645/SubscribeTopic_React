import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { FacultyType, TeacherType } from '@assets/interface';
import { OptionType } from '@assets/types/common';
import { LanguageType } from '@assets/types/lang';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { Dropdown, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import * as yup from 'yup';

interface FacultyFormRefType {
	show?: (formData?: FacultyType) => void;
	close?: () => void;
}

interface FacultyFormType extends LanguageType {
	title: string;
	onSuccess?: (faculty: FacultyType) => void;
}

const FacultyForm = forwardRef<FacultyFormRefType, FacultyFormType>(({ title, lng, onSuccess }, ref) => {
	const toastRef = useRef<Toast>(null);
	const [visible, setVisible] = useState(false);
	const { t } = useTranslation(lng);
	const teacherQuery = useQuery({
		queryKey: ['faculty_teacher'],
		queryFn: async () => {
			const responseData: TeacherType[] = (await request.get(API.admin.teacher)).data.data;

			return responseData || [];
		},
	});
	const facultyMutation = useMutation<AxiosResponse, AxiosError<any, any>, FacultyType>({
		mutationFn: (faculty: FacultyType) => {
			return faculty.id === '0'
				? request.post(API.admin.faculty, faculty)
				: request.update(API.admin.faculty, faculty);
		},
	});
	const schema = yup.object({
		id: yup.string(),
		internalCode: yup.string().required().max(50),
		name: yup.string().required().max(150),
		phoneNumber: yup.string().required().max(10),
		address: yup.string().required().max(200),
		email: yup.string().required().email().max(30),
		dean_TeacherId: yup.string().required(),
	});
	const { setValue, control, handleSubmit, reset } = useForm({
		resolver: yupResolver(schema) as Resolver<FacultyType>,
		defaultValues: {
			id: '0',
			internalCode: '',
			name: '',
			phoneNumber: '',
			address: '',
			email: '',
			dean_TeacherId: '',
		},
	});
	const teacherOptions: OptionType[] =
		_.map(teacherQuery.data, (t) => ({ label: t.name || '', value: t.id || '', code: t.id || '' })) || [];

	const show = (formData?: FacultyType) => {
		setVisible(true);

		if (formData) {
			setValue('id', formData.id);
			setValue('internalCode', formData.internalCode);
			setValue('name', formData.name);
			setValue('phoneNumber', formData.phoneNumber);
			setValue('address', formData.address);
			setValue('email', formData.email);
			setValue('dean_TeacherId', formData.dean_TeacherId);
		}
	};

	const close = () => {
		setVisible(false);
	};

	const onSubmit = (formData: FacultyType) => {
		facultyMutation.mutate(formData, {
			onSuccess: (response) => {
				toastRef.current?.show({
					severity: 'success',
					summary: t('notify'),
					detail: t('request:update_success'),
				});
				close();
				onSuccess?.(response.data);
			},
			onError: (error) => {
				toastRef.current?.show({
					severity: 'error',
					summary: t('notify'),
					detail: error.response?.data?.messages[0] || error.message,
				});
			},
		});
	};

	useImperativeHandle(ref, () => ({
		show,
		close,
	}));

	return (
		<Dialog
			header={title}
			visible={visible}
			style={{ width: '50vw' }}
			className='overflow-hidden'
			contentStyle={{ marginBottom: '5.6rem' }}
			onHide={() => {
				close();
				reset();
			}}
		>
			<Toast ref={toastRef} />
			<Loader show={facultyMutation.isLoading} />
			<form
				className='mt-2 flex flex-column gap-3'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-column gap-2'>
					<p className='font-semibold'>{t('code_of', { obj: t('module:faculty') })}</p>
					<Controller
						name='internalCode'
						control={control}
						render={({ field, fieldState, formState }) => (
							<InputText
								id='form_data_internal_code'
								value={field.value}
								placeholder={t('code_of', { obj: t('module:faculty') })}
								errorMessage={fieldState.error?.message}
								onChange={(e) => field.onChange(e.target.value)}
							/>
						)}
					/>
				</div>

				<div className='flex flex-column gap-2'>
					<p className='font-semibold'>{t('name_of', { obj: t('module:faculty') })}</p>
					<Controller
						name='name'
						control={control}
						render={({ field, fieldState }) => (
							<InputText
								id='form_data_name'
								value={field.value}
								placeholder={t('name_of', { obj: t('module:faculty') })}
								errorMessage={fieldState.error?.message}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>

				<div className='flex flex-column gap-2'>
					<p className='font-semibold'>{t('address')}</p>
					<Controller
						name='address'
						control={control}
						render={({ field, fieldState }) => (
							<InputText
								id='form_data_address'
								value={field.value}
								placeholder={t('address')}
								errorMessage={fieldState.error?.message}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
						)}
					/>
				</div>

				<div className='flex flex-column gap-2'>
					<p className='font-semibold'>{t('phone_number')}</p>
					<Controller
						name='phoneNumber'
						control={control}
						render={({ field, fieldState }) => (
							<InputText
								id='form_data_phone_number'
								value={field.value}
								placeholder={t('phone_number')}
								errorMessage={fieldState.error?.message}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
						)}
					/>
				</div>

				<div className='flex flex-column gap-2'>
					<p className='font-semibold'>{t('email')}</p>
					<Controller
						name='email'
						control={control}
						render={({ field, fieldState }) => (
							<InputText
								id='form_data_email'
								value={field.value}
								placeholder={t('email')}
								errorMessage={fieldState.error?.message}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
						)}
					/>
				</div>

				<div className='flex flex-column gap-2'>
					<p className='font-semibold'>{t('module:field.faculty.dean')}</p>
					<Controller
						name='dean_TeacherId'
						control={control}
						render={({ field, fieldState }) => (
							<Dropdown
								id='form_data_teacher_id'
								placeholder={t('module:field.faculty.dean')}
								options={teacherOptions}
								value={field.value}
								errorMessage={fieldState.error?.message}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>

				<div className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white p-4'>
					<Button
						label={t('cancel')}
						icon='pi pi-undo'
						severity='secondary'
						onClick={(e) => {
							e.preventDefault();
							reset();
							close();
						}}
					/>
					<Button
						label={t('save')}
						icon='pi pi-save'
					/>
				</div>
			</form>
		</Dialog>
	);
});

export default FacultyForm;
export type { FacultyFormRefType };
