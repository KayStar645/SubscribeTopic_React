'use client';

import { AUTH_TOKEN } from '@assets/configs';
import { request } from '@assets/helpers';
import { PageProps } from '@assets/types/UI';
import { ConfirmModalRefType } from '@assets/types/modal';
import Loader from '@resources/components/UI/Loader';
import ConfirmModal from '@resources/components/modal/ConfirmModal';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const TAG_BG: any = {
    n: 'bg-gray-700',
    c: 'bg-red-600',
    r: 'bg-primary',
    dy: 'bg-orange-500',
    de: 'bg-green-600',
};

const ORDER_STATUS: any = {
    n: 'bg-gray-700',
    c: 'bg-red-600',
    r: 'bg-primary',
    dy: 'bg-orange-500',
    de: 'bg-green-600',
};

const FacultyPage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const toastRef = useRef<Toast>(null);
    const user = hasCookie(AUTH_TOKEN) ? JSON.parse(getCookie(AUTH_TOKEN)!) : {};
    const router = useRouter();
    const productQuery = useQuery({
        queryKey: ['products', 'list'],
        queryFn: async () => {
            const response = await request.get(`/Product/by-shop/${user.shop._id}`);

            return response.data || [];
        },
    });
    const removeProductMutation = useMutation({
        mutationFn: (data: any) => {
            return request.remove(`/Product/${data.id}`);
        },
    });

    const renderActions = (product: any) => {
        return (
            <div className='flex align-items-center gap-3'>
                <i
                    className='pi pi-pencil hover:text-primary cursor-pointer'
                    onClick={() => router.push(`/vi/home/product/${product.id}`)}
                ></i>
                <i
                    className='pi pi-trash hover:text-red-600 cursor-pointer'
                    onClick={(e) => {
                        confirmModalRef.current?.show?.(e, product, t('sure_to_delete', { obj: product.name }));
                    }}
                ></i>
            </div>
        );
    };

    const onRemoveProduct = (product: any) => {
        removeProductMutation.mutate(product, {
            onSuccess: () => {
                toastRef.current?.show({
                    severity: 'success',
                    summary: t('notification'),
                    detail: t('request:update_success'),
                });

                productQuery.refetch();
            },
        });
    };

    const statusBodyTemplate = (product: any) => {
        return <Checkbox checked={product.is_active} />;
    };

    return (
        <div className='flex flex-column gap-4'>
            <Toast ref={toastRef} />

            <ConfirmModal
                ref={confirmModalRef}
                onAccept={onRemoveProduct}
                acceptLabel={t('confirm')}
                rejectLabel={t('cancel')}
            />

            <div className='flex align-items-center justify-content-between bg-white py-2 px-3 border-round-lg shadow-3'>
                <p className='text-xl font-semibold'>Danh sách sản phẩm</p>
                <Button
                    label={t('create_new')}
                    icon='pi pi-plus'
                    size='small'
                    onClick={() => {
                        router.push(`/vi/home/product/0`);
                    }}
                />
            </div>
            <div className='flex align-items-center justify-content-between'>
                <InputText placeholder={`${t('search')}...`} />
            </div>
            <div className='border-round-xl overflow-hidden relative shadow-5'>
                <Loader show={productQuery.isLoading || removeProductMutation.isLoading} />

                <DataTable
                    value={productQuery.data || []}
                    rowHover={true}
                    stripedRows={true}
                    emptyMessage={t('list_empty')}
                >
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        header={t('action')}
                        body={renderActions}
                    ></Column>
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='id'
                        body={(product) => product.id.substr(24 - 6, 6)}
                        header='Mã sản phẩm'
                    ></Column>
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='name'
                        header='Tên sản phẩm'
                    ></Column>
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        body={(product: any) => <Avatar image={product.image} size='xlarge' />}
                        field='image'
                        header={'Ảnh'}
                    ></Column>
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        field='product_category.name'
                        header='Nhóm sản phẩm'
                    ></Column>
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        bodyClassName='text-center'
                        field='sole_number'
                        header='Đã bán'
                    ></Column>
                    <Column
                        headerStyle={{
                            background: 'var(--primary-color)',
                            color: 'var(--surface-a)',
                            whiteSpace: 'nowrap',
                        }}
                        bodyClassName='text-center'
                        body={statusBodyTemplate}
                        header='Trạng thái'
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default FacultyPage;
