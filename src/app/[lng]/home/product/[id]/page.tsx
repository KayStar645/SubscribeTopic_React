'use client';

import { request } from '@assets/helpers';
import { PageProps } from '@assets/types/UI';
import Loader from '@resources/components/UI/Loader';
import { Checkbox, InputText } from '@resources/components/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { Panel } from 'primereact/panel';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { getCookie, hasCookie } from 'cookies-next';
import { AUTH_TOKEN } from '@assets/configs';
import { Toast } from 'primereact/toast';

const Page = ({ params }: PageProps) => {
    const [showFormImage, setShowFormImage] = useState(false);
    const [showFormImages, setShowFormImages] = useState(false);
    const [showProperties, setShowProperties] = useState(false);
    const [image, setImage] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const user = hasCookie(AUTH_TOKEN) ? JSON.parse(getCookie(AUTH_TOKEN)!) : {};
    const toastRef = useRef<Toast>(null);
    const { control, setValue, handleSubmit, getValues } = useForm<any>({
        defaultValues: {
            description: '',
            id: '',
            image: '',
            images: [],
            in_stock: 0,
            is_active: true,
            name: '',
            policies: '',
            price: 0,
            product_category: {
                _id: '',
                name: '',
            },
            properties: [],
            rating: 5,
            shop: {},
            sole_number: 0,
            comments: [],
        },
    });
    const productDetailQuery = useQuery({
        queryKey: ['product_detail'],
        enabled: false,
        queryFn: async () => {
            const response = await request.get(`/Product/${params.id}`);

            return response.data;
        },
        onSuccess: (data) => {
            let keys = Object.keys(data);

            keys.forEach((key: any) => {
                setValue(key, data[key]);
            });

            setImage(data.image);
            setImages(data.images);
            setProperties(data.properties);
        },
    });
    const productCategoryQuery = useQuery({
        queryKey: ['product_category'],
        enabled: false,
        queryFn: async () => {
            const response = await request.get(`/ProductCategory`);

            return response.data;
        },
    });
    const productUpdateMutate = useMutation({
        mutationFn: (data: any) => {
            let response = request.update(`/Product/${params.id}`, data);

            return response;
        },
    });
    const productCreateMutate = useMutation({
        mutationFn: (data: any) => {
            let response = request.post('/Product', data);

            return response;
        },
    });
    const router = useRouter();

    const Footer = () => {
        return (
            <div className='flex align-items-center justify-content-end gap-3'>
                <Button label='Hủy' severity='danger' />
                <Button label='Cập nhập' />
            </div>
        );
    };

    const onSubmit = (data: any) => {
        data.product_category = productCategoryQuery.data.find((t: any) => t._id === data.product_category);
        data.shop = user.shop;

        if (params.id === '0') {
            productCreateMutate.mutate(data, {
                onSuccess() {
                    toastRef.current?.show({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Thêm sản phẩm thành công',
                        life: 1000,
                    });

                    setTimeout(() => {
                        router.back();
                    }, 1000);
                },
            });
        } else {
            productUpdateMutate.mutate(data, {
                onSuccess() {
                    toastRef.current?.show({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Cập nhập sản phẩm thành công',
                        life: 1000,
                    });

                    setTimeout(() => {
                        router.back();
                    }, 1000);
                },
            });
        }
    };

    useEffect(() => {
        if (params.id !== '0') {
            productDetailQuery.refetch();
        }
        productCategoryQuery.refetch();
    }, []);

    const onFormImageConfirm = () => {
        setValue('image', image);
        setShowFormImage(false);
    };

    const onFormImagesConfirm = () => {
        setValue('images', images);
        setShowFormImages(false);
    };

    const onFormPropertiesConfirm = () => {
        setValue('properties', properties);
        setShowProperties(false);
    };

    const formImageFooter = () => {
        return (
            <div className='flex align-items-center justify-content-end'>
                <Button label='Hủy' severity='danger' />
                <Button label='Xác nhận' onClick={onFormImageConfirm} />
            </div>
        );
    };

    const formImagesFooter = () => {
        return (
            <div className='flex align-items-center justify-content-end'>
                <Button label='Hủy' severity='danger' />
                <Button label='Xác nhận' onClick={onFormImagesConfirm} />
            </div>
        );
    };

    const onPropertiesBlur = (i: number, field: string, value: any) => {
        properties[i][field] = value;

        setProperties([...properties]);
    };

    const formPropertiesFooter = () => {
        return (
            <div className='flex align-items-center justify-content-end'>
                <Button label='Hủy' severity='danger' />
                <Button label='Xác nhận' onClick={onFormPropertiesConfirm} />
            </div>
        );
    };

    const onInputImagesBlue = (index: number, value: string) => {
        images[index] = value;

        setImages([...images]);
    };

    const onInputImageBlue = (value: string) => {
        setImage(value);
    };

    const onRemoveImagesItem = (i: number) => {
        images.splice(i, 1);

        setImages([...images]);
    };

    const onRemoveProperties = (i: number) => {
        properties.splice(i, 1);

        setProperties([...properties]);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Toast ref={toastRef} />
            <Card title={params.id !== '0' ? `Cập nhập sản phẩm` : 'Thêm mới sản phẩm'} footer={Footer}>
                <Loader show={(params.id !== '0' && productDetailQuery.isLoading) || productCategoryQuery.isFetching} />

                <div className='flex flex-column gap-4'>
                    <Panel header='Thông tin cơ bản' collapsed={true} toggleable={true}>
                        <div className='flex flex-column gap-4'>
                            <Controller
                                control={control}
                                name='name'
                                render={({ field }) => (
                                    <InputText
                                        placeholder='Tên sản phẩm'
                                        value={field.value}
                                        label='Tên sản phẩm'
                                        id='product_name'
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='policies'
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor={field.name} className='text-900 font-medium block mb-2'>
                                            Chính sách
                                        </label>
                                        <InputText
                                            id={field.name}
                                            placeholder='Chính sách'
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </div>
                                )}
                            />

                            <div className='flex align-items-center gap-5'>
                                <Controller
                                    control={control}
                                    name='price'
                                    render={({ field }) => (
                                        <div>
                                            <label htmlFor={field.name} className='text-900 font-medium block mb-2'>
                                                Giá
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                placeholder='Giá'
                                                value={field.value}
                                                currency='VND'
                                                locale='vi-VN'
                                                inputClassName='text-right'
                                                mode='currency'
                                                onValueChange={(e) => field.onChange(e)}
                                            />
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='in_stock'
                                    render={({ field }) => (
                                        <div>
                                            <label htmlFor={field.name} className='text-900 font-medium block mb-2'>
                                                Tồn kho
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                placeholder='Tồn kho'
                                                inputClassName='text-right'
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e)}
                                            />
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='sole_number'
                                    render={({ field }) => (
                                        <div>
                                            <label htmlFor={field.name} className='text-900 font-medium block mb-2'>
                                                Đã bán
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                placeholder='Đã bán'
                                                inputClassName='text-right'
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e)}
                                            />
                                        </div>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name='product_category'
                                    defaultValue={productDetailQuery.data?.product_category?.id}
                                    render={({ field }) => (
                                        <div>
                                            <label htmlFor={field.name} className='text-900 font-medium block mb-2'>
                                                Nhóm sản phẩm
                                            </label>
                                            <Dropdown
                                                id={field.name}
                                                value={field.value}
                                                placeholder='Nhóm sản phẩm'
                                                options={productCategoryQuery.data?.map((t: any) => ({
                                                    label: t.name,
                                                    value: t._id,
                                                    code: t._id,
                                                }))}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            <Controller
                                control={control}
                                name='is_active'
                                render={({ field }) => (
                                    <div className='flex align-items-center'>
                                        <Checkbox
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.checked)}
                                        />
                                        <label htmlFor={field.name} className='text-900 font-medium block'>
                                            Trạng thái
                                        </label>
                                    </div>
                                )}
                            />

                            <Controller
                                name='description'
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor={field.name} className='text-900 font-medium block mb-2'>
                                            Mô tả sản phẩm
                                        </label>
                                        <CKEditor
                                            editor={Editor}
                                            data={field.value}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();

                                                setValue('description', data);
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </Panel>

                    <Panel header='Chi tiết sản phẩm' collapsed={true} toggleable={true}>
                        <div className='flex flex-column gap-4'>
                            <div
                                className='flex align-items-center gap-2 cursor-pointer w-fit'
                                onClick={() => setShowProperties(true)}
                            >
                                <div className='w-2rem h-2rem bg-primary border-circle flex align-items-center justify-content-center'>
                                    <i className='pi pi-plus'></i>
                                </div>
                                <p className='text-900 font-semibold'>Thêm</p>
                            </div>

                            <div className='flex flex-column gap-4'>
                                {properties.map((t: any) => (
                                    <div key={Math.random().toString()} className='flex align-items-center'>
                                        <p className='w-12rem'>{t.name}</p>
                                        <p className='text-900'>{t.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Panel>

                    <Panel header='Hình ảnh' collapsed={true} toggleable={true}>
                        <div className='flex flex-column gap-4'>
                            <Controller
                                control={control}
                                name='image'
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor={field.name} className='text-900 font-medium block mb-2'>
                                            Ảnh chính
                                        </label>

                                        <div className='flex align-items-center gap-3'>
                                            <div className='flex-1'>
                                                <Image src={field.value} alt='' width='150' />
                                            </div>

                                            <div className='col-2 flex flex-column align-items-center justify-content-center gap-2 cursor-pointer'>
                                                <div
                                                    onClick={() => setShowFormImage(true)}
                                                    className='w-3rem h-3rem bg-primary border-circle flex align-items-center justify-content-center'
                                                >
                                                    <i className='pi pi-arrow-right-arrow-left'></i>
                                                </div>
                                                <p className='text-900 font-semibold'>Đổi</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <Controller
                                control={control}
                                name='images'
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor={field.name} className='text-900 font-medium block mb-2'>
                                            Danh sách ảnh
                                        </label>

                                        <div className='flex align-items-center justify-content-between'>
                                            <div className='flex-1 overflow-auto py-3'>
                                                <div className='flex align-items-center gap-3 w-7rem'>
                                                    {field.value.length > 0 &&
                                                        field.value.map((t: any) => (
                                                            <Image
                                                                src={t}
                                                                alt=''
                                                                width='150'
                                                                key={Math.random().toString()}
                                                            />
                                                        ))}
                                                </div>
                                            </div>

                                            <div className='col-2 flex flex-column align-items-center justify-content-center gap-2 cursor-pointer'>
                                                <div
                                                    onClick={() => setShowFormImages(true)}
                                                    className='w-3rem h-3rem bg-primary border-circle flex align-items-center justify-content-center'
                                                >
                                                    <i className='pi pi-plus'></i>
                                                </div>
                                                <p className='text-900 font-semibold'>Thêm</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </Panel>
                </div>
            </Card>

            <Dialog
                header='Ảnh chính'
                visible={showFormImage}
                style={{ width: '50vw' }}
                onHide={() => setShowFormImage(false)}
                footer={formImageFooter}
            >
                <div className='p-overlay-badge flex w-full gap-3'>
                    <Image src={image} alt='' width='100' imageClassName='shadow-3 border-round-md' />

                    <div className='flex-1'>
                        <InputText
                            placeholder='Ảnh'
                            id={Math.random().toString()}
                            value={image}
                            onBlur={(e) => onInputImageBlue(e.target.value)}
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Danh sách ảnh'
                visible={showFormImages}
                style={{ width: '70vw' }}
                onHide={() => setShowFormImages(false)}
                footer={formImagesFooter}
            >
                <div className='flex flex-column gap-4 pt-3'>
                    <div
                        className='flex align-items-center gap-2 cursor-pointer w-fit'
                        onClick={() => setImages(['', ...images])}
                    >
                        <div
                            onClick={() => setShowFormImages(true)}
                            className='w-2rem h-2rem bg-primary border-circle flex align-items-center justify-content-center'
                        >
                            <i className='pi pi-plus'></i>
                        </div>
                        <p className='text-900 font-semibold'>Thêm</p>
                    </div>

                    {images.map((t, i) => (
                        <div key={Math.random().toString()} className='p-overlay-badge flex w-full gap-3'>
                            <Image src={t} alt='' width='100' imageClassName='shadow-3 border-round-md' />

                            <div className='flex-1'>
                                <InputText
                                    placeholder='Ảnh'
                                    id={Math.random().toString()}
                                    value={t}
                                    onBlur={(e) => onInputImagesBlue(i, e.target.value)}
                                />
                            </div>

                            <Badge
                                value={'X'}
                                severity={'danger'}
                                className='cursor-pointer'
                                onClick={() => onRemoveImagesItem(i)}
                            />
                        </div>
                    ))}
                </div>
            </Dialog>

            <Dialog
                header='Chi tiết sản phẩm'
                visible={showProperties}
                style={{ width: '70vw' }}
                onHide={() => setShowProperties(false)}
                footer={formPropertiesFooter}
            >
                <div className='flex flex-column gap-4 pt-3'>
                    <div
                        className='flex align-items-center gap-2 cursor-pointer w-fit'
                        onClick={() => setProperties([{ name: '', value: '' }, ...properties])}
                    >
                        <div
                            onClick={() => setShowProperties(true)}
                            className='w-2rem h-2rem bg-primary border-circle flex align-items-center justify-content-center'
                        >
                            <i className='pi pi-plus'></i>
                        </div>
                        <p className='text-900 font-semibold'>Thêm</p>
                    </div>

                    {properties.map((t, i) => (
                        <div key={Math.random().toString()} className='p-overlay-badge flex w-full gap-3'>
                            <InputText
                                id={Math.random().toString()}
                                placeholder='Tên thuộc tính'
                                value={t.name}
                                onBlur={(e) => onPropertiesBlur(i, 'name', e.target.value)}
                            />

                            <div className='flex-1'>
                                <InputText
                                    id={Math.random().toString()}
                                    placeholder='Giá trị thuộc tính'
                                    value={t.value}
                                    onBlur={(e) => onPropertiesBlur(i, 'value', e.target.value)}
                                />
                            </div>

                            <Badge
                                value={'X'}
                                severity={'danger'}
                                className='cursor-pointer'
                                onClick={() => onRemoveProperties(i)}
                            />
                        </div>
                    ))}
                </div>
            </Dialog>
        </form>
    );
};

export default Page;
