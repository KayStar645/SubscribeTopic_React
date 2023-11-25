'use client';

import { API, MODULE } from '@assets/configs';
import { request } from '@assets/helpers';
import usePermission from '@assets/hooks/usePermission';
import { AccountType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import { ResponseType } from '@assets/types/request';
import { Loader } from '@resources/components/UI';
import { ConfirmModal } from '@resources/components/modal';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import AccountForm, { AccountFormRefType } from './form';

const AccountPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const formRef = useRef<AccountFormRefType>(null);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [selected, setSelected] = useState<AccountType>();
    const permission = usePermission(MODULE.account);

    const accountQuery = useQuery<AccountType[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['users', 'list'],
        queryFn: async () => {
            const response = await request.get<AccountType[]>(`${API.admin.account}`);

            return response.data.data || [];
        },
        onError: (err) => {
            toast.error(err.response?.data.messages?.[0] || err.message);
        },
    });

    const accountMutation = useMutation<any, AxiosError<ResponseType>, AccountType>({
        mutationFn: (data) => {
            return request.remove(`${API.admin.account}`, { params: { id: data.id } });
        },
    });

    const onRemove = (data: AccountType) => {
        accountMutation.mutate(data, {
            onSuccess: () => {
                accountQuery.refetch();
                toast.success(t('request:update_success'));
            },
            onError: (err) => {
                toast.error(err.response?.data.messages?.[0] || err.message);
            },
        });
    };

    const AccountName = (data: AccountType) => {
        let name = data.userName;

        if (data.student) {
            name = data.student.name;
        } else if (data.teacher) {
            name = data.teacher.name;
        }

        return <p>{name}</p>;
    };

    const AccountCode = (data: AccountType) => {
        let code = data.userName;

        if (data.student) {
            code = data.student.internalCode!;
        } else if (data.teacher) {
            code = data.teacher.internalCode!;
        }

        return <p>{code}</p>;
    };

    const AccountDateBirth = (data: AccountType) => {
        let address = '';

        if (data.student) {
            address = moment(data.student.dateOfBirth?.toLocaleString()!).format('DD/MM/YYYY');
        } else if (data.teacher) {
            address = moment(data.teacher.dateOfBirth?.toLocaleString()!).format('DD/MM/YYYY');
        }

        return <p className='text-center'>{address}</p>;
    };

    const AccountPhoneNumber = (data: AccountType) => {
        let phoneNumber = '';

        if (data.student) {
            phoneNumber = data.student.phoneNumber || '';
        } else if (data.teacher) {
            phoneNumber = data.teacher.phoneNumber || '';
        }

        return <p className='text-center'>{phoneNumber}</p>;
    };

    return (
        <div className='flex flex-column gap-4'>
            <ConfirmModal
                ref={confirmModalRef}
                onAccept={onRemove}
                acceptLabel={t('confirm')}
                rejectLabel={t('cancel')}
            />

            <div className='flex align-items-center justify-content-between bg-white h-4rem px-3 border-round-lg shadow-3'>
                <p className='text-xl font-semibold'>{t('list_of', { module: t('module:account').toLowerCase() })}</p>

                <Button
                    label={t('create_new')}
                    icon='pi pi-plus'
                    size='small'
                    visible={permission.create}
                    onClick={() => {
                        formRef.current?.show?.();
                        setSelected(undefined);
                    }}
                />
            </div>

            <div className='flex align-items-center justify-content-between'>
                <InputText placeholder={`${t('search')}...`} className='w-20rem' />
            </div>

            <div className='border-round-xl overflow-hidden relative shadow-5'>
                <Loader show={accountQuery.isLoading || accountMutation.isLoading} />

                <DataTable
                    value={accountQuery.data}
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
                        header={t('common:code_of', { obj: t('module:account').toLowerCase() })}
                        body={AccountCode}
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={t('common:name_of', { obj: t('module:account').toLowerCase() })}
                        body={AccountName}
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={t('common:phone_number')}
                        body={AccountPhoneNumber}
                    />
                    <Column
                        alignHeader='center'
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={t('date_of_birth')}
                        body={AccountDateBirth}
                    />
                </DataTable>
            </div>

            <AccountForm
                lng={lng}
                title={
                    selected?.id
                        ? t('update_at', { obj: selected.userName })
                        : t('create_new_at', { obj: t('module:account').toLowerCase() })
                }
                ref={formRef}
                onSuccess={(_data) => accountQuery.refetch()}
            />
        </div>
    );
};

export default AccountPage;
