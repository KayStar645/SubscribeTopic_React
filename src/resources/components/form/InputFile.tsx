'use client';

import { API } from '@assets/configs';
import { IMAGE_MIME_TYPE, MIME_TYPES } from '@assets/configs/mime_type';
import { request } from '@assets/helpers';
import { FileType, InputFileProps } from '@assets/types/form';
import { useMutation } from '@tanstack/react-query';
import { forEach } from 'lodash';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { useRef, useState } from 'react';
import { Loader } from '../UI';

const InputFile = ({
    value,
    multiple,
    accept = '*',
    label,
    placeholder = 'Danh sách file',
    folder,
    onChange = () => {},
}: InputFileProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileType[]>(value || []);

    const fileMutation = useMutation<any, ResponseType, { fileName: string; file: File }>({
        mutationFn: (data) => {
            console.log(data);

            return request.post(`${API.admin.google_drive}?fileName=${data.fileName}`, { File: data.file });
        },
    });

    const File = ({ file }: { file: FileType }) => {
        const size = Math.ceil(file.size / 1024);

        return (
            <div className='flex align-items-center flex-1 gap-3'>
                {IMAGE_MIME_TYPE['.' + file.type] && (
                    <Link href={file.link} target='_blank'>
                        <Image src={file.link} alt={file.name} width='100' imageClassName='border-round' />
                    </Link>
                )}

                <div className='flex flex-column align-items-start justify-content-between flex-1 gap-2'>
                    <Link href={file.link} target='_blank' className='text-primary' style={{ wordBreak: 'break-all' }}>
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

    console.log(fileMutation.isSuccess);

    return (
        <div className='border-round-xl bg-white border-1 border-solid border-300 relative'>
            <Loader show={fileMutation.isPending} />

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

                    let result: FileType[] = [];

                    forEach(e.target.files, (file) => {
                        fileMutation.mutate({
                            fileName: folder || 'test_image',
                            file,
                        });

                        result.push({
                            link: URL.createObjectURL(file),
                            name: file.name.split('.')[0],
                            size: file.size,
                            type: file.name.split('.').pop()!,
                        });
                    });

                    setFiles((prev) => {
                        onChange([...prev, ...result]);

                        return [...prev, ...result];
                    });
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
                        <div className='flex align-items-center gap-3 col-3 py-3' key={file.name + '_' + file.type}>
                            <i
                                className='pi pi-trash cursor-pointer hover:text-red-600'
                                onClick={() => setFiles(files.filter((t, i) => i !== index))}
                            />
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
