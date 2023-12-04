'use client';

import { API } from '@assets/configs';
import { IMAGE_MIME_TYPE, MIME_TYPES } from '@assets/configs/mime_type';
import { request } from '@assets/helpers';
import { FileType, InputFileProps } from '@assets/types/form';
import { ResponseType } from '@assets/types/request';
import { useMutation } from '@tanstack/react-query';
import { forEach } from 'lodash';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { RadioButton } from 'primereact/radiobutton';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Loader } from '../UI';
import { AxiosResponse } from 'axios';

const InputFile = ({
    value,
    multiple,
    accept = '*',
    label,
    placeholder = 'Danh sách file',
    folder,
    defaultFileText = 'Mặc định',
    onChange = () => {},
}: InputFileProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileType[]>(value || []);
    const [defaultFile, setDefaultFile] = useState<number>(0);

    const fileMutation = useMutation<
        AxiosResponse<ResponseType<FileType>>,
        ResponseType<FileType>,
        { fileName: string; file: File }
    >({
        mutationFn: async (data) => {
            const formData = new FormData();

            formData.append('file', data.file);

            return request.post(`${API.admin.google_drive}?fileName=${data.fileName}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
    });

    const File = ({ file }: { file: FileType }) => {
        const size = Math.ceil(file.sizeInBytes / 1024);

        return (
            <div className='flex align-items-center flex-1 gap-3'>
                {IMAGE_MIME_TYPE['.' + file.type] && (
                    <Link href={file.path} target='_blank'>
                        <Image src={file.path} alt={file.name} width='100' imageClassName='border-round' />
                    </Link>
                )}

                <div className='flex flex-column align-items-start justify-content-between flex-1 gap-2'>
                    <Link href={file.path} target='_blank' className='text-primary' style={{ wordBreak: 'break-all' }}>
                        {file.name}
                    </Link>

                    <div className='flex align-items-center gap-2'>
                        <Tag
                            value={
                                <div className='flex align-items-center gap-1 w-fit'>
                                    {MIME_TYPES['.' + file.type]}
                                    <p>{file.type}</p>
                                </div>
                            }
                            severity={'info'}
                        />

                        <Tag
                            value={size >= 1024 ? Math.ceil(size / 1024) + ' MB' : size + ' KB'}
                            severity={'warning'}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='border-round-xl bg-white border-1 border-solid border-300 relative'>
            <Loader show={fileMutation.isPending} />

            <input
                type='file'
                value=''
                accept={accept}
                ref={inputRef}
                multiple={multiple}
                hidden={true}
                onChange={(e) => {
                    if (!e.target.files) {
                        return;
                    }

                    if (multiple) {
                        forEach(e.target.files, async (file) => {
                            try {
                                const response = await fileMutation.mutateAsync({
                                    fileName: folder + file.name.split('.')[0],
                                    file,
                                });

                                if (response.data.data) {
                                    setFiles((prev) => {
                                        onChange({
                                            files: [...prev, response.data.data!],
                                        });

                                        return [...prev, response.data.data!];
                                    });
                                }
                            } catch (error: any) {
                                toast.error(error.message);
                            }
                        });
                    } else {
                        fileMutation.mutate(
                            {
                                fileName: folder + e.target.files[0].name.split('.')[0],
                                file: e.target.files[0],
                            },
                            {
                                onSuccess(response) {
                                    if (response.data.data) {
                                        onChange({
                                            file: response.data.data!,
                                            files: [response.data.data!],
                                        });
                                    }
                                },
                            },
                        );
                    }
                }}
            />

            <div className='flex align-items-center gap-3 p-3 border-bottom-1 border-300'>
                {label && <p>{label}</p>}

                <Button
                    rounded={true}
                    outlined={true}
                    icon='pi pi-fw pi-file'
                    className='w-2rem h-2rem'
                    onClick={(e) => {
                        e.preventDefault();

                        inputRef.current?.click();
                    }}
                />

                <Button
                    rounded={true}
                    outlined={true}
                    icon='pi pi-fw pi-trash'
                    severity='danger'
                    className='w-2rem h-2rem'
                    onClick={(e) => {
                        e.preventDefault();

                        setFiles([]);
                    }}
                />
            </div>

            <div className='p-3 flex flex-wrap'>
                {files.length > 0 ? (
                    files?.map((file, index) => (
                        <div
                            className='flex align-items-center gap-3 col-3 py-3'
                            key={file.name + '_' + file.sizeInBytes}
                        >
                            <div className='flex flex-column gap-3 align-items-center'>
                                {multiple && (
                                    <RadioButton
                                        tooltip={defaultFileText}
                                        tooltipOptions={{ position: 'left' }}
                                        className={classNames(`.${file.name + '_' + file.sizeInBytes}`)}
                                        checked={defaultFile === index}
                                        onChange={() => {
                                            setDefaultFile(index);

                                            onChange({
                                                file,
                                                files,
                                            });
                                        }}
                                    />
                                )}
                                <i
                                    className='pi pi-trash cursor-pointer hover:text-red-600'
                                    onClick={() => setFiles(files.filter((t, i) => i !== index))}
                                />
                            </div>
                            <File file={file} />
                        </div>
                    ))
                ) : (
                    <div>{placeholder}</div>
                )}
            </div>
        </div>
    );
};

export { InputFile };
