'use client';

import { API, MODULE } from '@assets/configs';
import { request } from '@assets/helpers';
import usePermission from '@assets/hooks/usePermission';
import { CouncilParamType, CouncilType, DepartmentDutyType, TeacherType, TopicType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Dropdown, InputText } from '@resources/components/form';
import { MultiSelect } from '@resources/components/form/MultiSelect';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { useEffect, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const defaultValues: CouncilType = {
    id: '0',
    internalCode: '',
    name: '',
};

interface MemberType {
    commissioners?: {
        position: string;
        teacherId: number;
    }[];
    president?: {
        position: string;
        teacherId: number;
    };
    secretary?: {
        position: string;
        teacherId: number;
    };
}

const defaultMemberValues: MemberType = {
    commissioners: [],
    president: undefined,
    secretary: undefined,
};

const schema = (t: TFunction) =>
    yup.object({
        internalCode: yup.string().required(),
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:council') }).toLowerCase(),
            }),
        ),
    });

const CouncilForm = ({ params: _params }: PageProps) => {
    const { lng, id } = _params;
    const { t } = useTranslation(lng);
    const router = useRouter();
    const permission = usePermission(MODULE.council);
    const [visible, setVisible] = useState(false);
    const [dutyId, setDutyId] = useState(0);
    const [members, setMembers] = useState<MemberType>(defaultMemberValues);

    const { control, handleSubmit, setValue, reset, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<CouncilType>,
        defaultValues,
    });

    const councilQuery = useQuery<TopicType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['council', 'list'],
        queryFn: async () => {
            const response = await request.get<TopicType[]>(`${API.admin.topic}`);

            return response.data.data || [];
        },
    });

    const councilDetailQuery = useQuery<CouncilType | null, AxiosError<ResponseType>>({
        queryKey: ['council_detail', id],
        refetchOnWindowFocus: false,
        enabled: id !== '0',
        queryFn: async () => {
            const params: CouncilParamType = {
                id,
                isAllDetail: true,
            };

            const response = await request.get<CouncilType>(API.admin.detail.council, { params });

            return response.data.data;
        },
    });

    const teacherQuery = useQuery<TeacherType[], AxiosError<ResponseType>>({
        queryKey: ['council_teachers', 'list'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<TeacherType[]>(API.admin.teacher);

            return response.data.data || [];
        },
    });

    const councilMutation = useMutation<any, AxiosError<ResponseType>, CouncilType>({
        mutationFn: async (data) => {
            data.commissioners = [...(members.commissioners || [])];

            if (members?.secretary?.teacherId == 0) {
                data.commissioners.push(members.secretary);
            }

            if (members?.president?.teacherId == 0) {
                data.commissioners.push(members.president);
            }

            return id == '0'
                ? request.post<CouncilType>(API.admin.council, data)
                : request.update<CouncilType>(API.admin.council, data);
        },
    });

    const onSubmit = (data: CouncilType) => {
        councilMutation.mutate(data, {
            onSuccess: () => {
                toast.success(t('request:update_success'));
                router.back();
            },
        });
    };

    useEffect(() => {
        if (id == 0) reset(defaultValues);
        if (councilDetailQuery.data) {
            let nData = councilDetailQuery.data;
            let memberData: MemberType = defaultMemberValues;

            memberData.commissioners = councilDetailQuery.data.commissioners?.filter((t) => t.position === 'M') || [];

            if (councilDetailQuery.data.commissioners?.find((t) => t.position === 'C')) {
                memberData.president = councilDetailQuery.data.commissioners?.find((t) => t.position === 'C');
            }

            if (councilDetailQuery.data.commissioners?.find((t) => t.position === 'S')) {
                memberData.secretary = councilDetailQuery.data.commissioners?.find((t) => t.position === 'S');
            }

            setMembers(memberData);
            reset(nData);
        }
    }, [councilDetailQuery.data, id, reset]);

    return (
        <div className='p-3 bg-white border-round shadow-3'>
            <Loader show={councilMutation.isPending || councilDetailQuery.isFetching || teacherQuery.isFetching} />

            <p className='text-2xl font-bold text-800 pb-3'>
                {id > 0 ? `Cập nhập ${councilDetailQuery?.data?.name}` : `Thêm mới hội đồng`}
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-wrap'>
                    <div className='col-6 flex flex-column gap-3 '>
                        <Controller
                            name='internalCode'
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputText
                                    id='form_data_internal_code'
                                    value={field.value}
                                    label={t('common:code_of', { obj: 'hội đồng' })}
                                    placeholder={t('common:code_of', {
                                        obj: 'hội đồng',
                                    })}
                                    errorMessage={fieldState.error?.message}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Dropdown
                            id={`presidentId`}
                            label='Chủ tịch'
                            placeholder='Chủ tịch'
                            emptyMessage={t('common:list_empty')}
                            value={members.president?.teacherId}
                            options={teacherQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                            onChange={(e) =>
                                setMembers((prev) => ({
                                    ...prev,
                                    president: {
                                        position: 'C',
                                        teacherId: parseInt(e),
                                    },
                                }))
                            }
                        />
                    </div>

                    <div className='col-6 flex flex-column gap-3'>
                        <Controller
                            name='name'
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputText
                                    id='form_data_name'
                                    value={field.value}
                                    label={t('common:name_of', { obj: 'hội đồng' })}
                                    placeholder={t('common:name_of', {
                                        obj: 'hội đồng',
                                    })}
                                    errorMessage={fieldState.error?.message}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <Dropdown
                            id={`secretaryId`}
                            label='Thư ký'
                            placeholder='Thư ký'
                            emptyMessage={t('common:list_empty')}
                            value={members.secretary?.teacherId}
                            options={teacherQuery.data?.map((t) => ({ label: t.name, value: t.id }))}
                            onChange={(e) =>
                                setMembers((prev) => ({
                                    ...prev,
                                    secretary: {
                                        position: 'S',
                                        teacherId: parseInt(e),
                                    },
                                }))
                            }
                        />
                    </div>

                    <div className='col-12'>
                        <MultiSelect
                            id={`councilMembers`}
                            label='Ủy viên'
                            placeholder='Ủy viên'
                            emptyMessage={t('common:list_empty')}
                            value={members.commissioners?.map((t) => t.teacherId)}
                            options={teacherQuery.data?.map((t) => ({
                                label: t.name,
                                value: t.id,
                            }))}
                            onChange={(e) => {
                                console.log('🚀 ~ file: page.tsx:259 ~ CouncilForm ~ e:', e);

                                setMembers((prev) => ({
                                    ...prev,
                                    commissioners: e.value.map((t: number) => ({
                                        position: 'M',
                                        teacherId: t,
                                    })),
                                }));
                            }}
                        />
                    </div>

                    <div className='col-12'>
                        <Controller
                            name='location'
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputText
                                    id='form_data_internal_code'
                                    value={field.value}
                                    label='Địa điểm'
                                    placeholder='Địa điểm'
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>

                <div
                    className='flex align-items-center justify-content-end gap-2 fixed bottom-0 left-0 right-0 bg-white px-5 h-4rem shadow-8'
                    style={{ zIndex: 500 }}
                >
                    <Button
                        size='small'
                        label={t('cancel')}
                        icon='pi pi-undo'
                        severity='secondary'
                        onClick={() => {
                            router.back();
                        }}
                    />
                    {permission.update && <Button size='small' label={t('save')} icon='pi pi-save' />}
                </div>
            </form>

            <Dialog
                header='Đề tài thuộc nhiệm vụ'
                onHide={() => {
                    setDutyId(0);
                    setVisible(false);
                }}
                visible={visible}
                draggable={true}
                style={{ width: '50vw' }}
                className='relative overflow-hidden'
            >
                <Loader show={councilQuery.isFetching} />

                <DataTable
                    value={councilQuery.data}
                    rowHover={true}
                    stripedRows={true}
                    showGridlines={true}
                    emptyMessage={t('list_empty')}
                >
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={t('common:action')}
                        body={(data: DepartmentDutyType) => (
                            <div className='flex align-items-center justify-content-center'>
                                <RadioButton
                                    checked={data.id === dutyId}
                                    onChange={() => setDutyId(parseInt(data.id?.toString()!))}
                                />
                            </div>
                        )}
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='name'
                        header='Tên nhiệm vụ'
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='numberOfThesis'
                        header='Số lượng đề tài'
                    />
                </DataTable>

                <div className='flex align-items-center justify-content-end mt-3'>
                    <Button
                        label={t('common:approve_request')}
                        size='small'
                        severity='secondary'
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default CouncilForm;
