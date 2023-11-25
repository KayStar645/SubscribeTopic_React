'use client';

import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { InputFileProps } from '@assets/types/form';
import { ResponseType } from '@assets/types/request';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Image } from 'primereact/file';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Loader } from '../UI';

const InputFile = ({
    value,
    multiple,
    folderName,
    accept = '*',
    emptyList = 'List is empty',
    successMessage = 'Tải file thành công',
}: InputFileProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<string[]>(value || []);
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
        if (files.length === 0) {
            return;
        }

        files.forEach((file) => {
            mutate({
                FilePath: file,
                FileName: 'test' + Math.floor(Math.random() * 1000),
                FolderName: folderName,
            });
        });
    };

    const Type = ({ file }: { file: string }) => {
        console.log(file);

        return <div></div>;
    };

    return (
        <div className='border-round-xl bg-white border-round relative'>
            <Loader show={isLoading} />
            <input
                type='file'
                accept={accept}
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

                        result.push(file);
                    }

                    setFiles((prev) => [...prev, ...result]);
                }}
            />

            <div className='flex align-items-center gap-3 p-3 border-bottom-2 border-200'>
                <Button
                    rounded={true}
                    outlined={true}
                    icon='pi pi-fw pi-file'
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
                    onClick={() => setFiles([])}
                />
            </div>

            <div className='p-3 flex align-items-center gap-5'>
                {files.length > 0 ? (
                    files?.map((file, index) => (
                        <div className='p-overlay-badge' key={file}>
                            <Type file={file} />
                            <Badge
                                value='X'
                                severity='danger'
                                className='cursor-pointer'
                                onClick={() => setFiles(files.filter((t, i) => i !== index))}
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

export { InputFile };
