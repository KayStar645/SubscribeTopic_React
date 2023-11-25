'use client';

import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { InputImageProps } from '@assets/types/form';
import { ResponseType } from '@assets/types/request';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Loader } from '../UI';

const InputImage = ({
    value,
    multiple,
    folderName,
    emptyList = 'List is empty',
    successMessage = 'Tải file thành công',
}: InputImageProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<string[]>(value || []);
    const { isLoading, mutate } = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data) => {
            return request.post(API.admin.google_drive, data);
        },
        onSuccess() {
            toast.success(successMessage);
        },
        onError(error) {
            toast.error(error.response?.data?.messages || error?.message);
        },
    });

    const onUpload = () => {
        if (images.length === 0) {
            return;
        }

        images.forEach((image) => {
            mutate({
                FilePath: image,
                FileName: 'test' + Math.floor(Math.random() * 1000),
                FolderName: folderName,
            });
        });
    };

    return (
        <div className='border-round-xl bg-white border-round relative'>
            <Loader show={isLoading} />
            <input
                type='file'
                accept='image/*'
                ref={inputRef}
                multiple={multiple}
                hidden={true}
                onChange={(e) => {
                    if (!e.target.files) {
                        return;
                    }

                    let result: string[] = [];

                    for (let i = 0; i < e.target.files.length; i++) {
                        const file = e.target.files[i];

                        result.push(URL.createObjectURL(file));
                    }

                    setImages((prev) => [...prev, ...result]);
                }}
            />

            <div className='flex align-items-center gap-3 p-3 border-bottom-2 border-200'>
                <Button
                    rounded={true}
                    outlined={true}
                    icon='pi pi-fw pi-images'
                    onClick={() => inputRef.current?.click()}
                />

                <Button
                    rounded={true}
                    outlined={true}
                    icon='pi pi-fw pi-cloud-upload'
                    severity='success'
                    onClick={onUpload}
                />

                <Button
                    rounded={true}
                    outlined={true}
                    icon='pi pi-fw pi-times'
                    severity='danger'
                    onClick={() => setImages([])}
                />
            </div>

            <div className='p-3 flex align-items-center gap-5'>
                {images.length > 0 ? (
                    images?.map((image, index) => (
                        <div className='p-overlay-badge' key={image}>
                            <Image src={image} alt={image} width='100' />
                            <Badge
                                value='X'
                                severity='danger'
                                className='cursor-pointer'
                                onClick={() => setImages(images.filter((t, i) => i !== index))}
                            />
                        </div>
                    ))
                ) : (
                    <div>{emptyList}</div>
                )}
            </div>
        </div>
    );
};

export { InputImage };
