'use client';

import { IMAGE_MIME_TYPE, MIME_TYPES } from '@assets/configs/mime_type';
import { FileType, InputFileProps } from '@assets/types/form';
import { forEach } from 'lodash';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { useRef, useState } from 'react';

const InputFile = ({
    value,
    multiple,
    accept = '*',
    label,
    placeholder = 'Danh sách file',
    onChange = () => {},
}: InputFileProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileType[]>(value || []);

    const File = ({ file }: { file: FileType }) => {
        const size = Math.ceil(file.size / 1024);

        console.log(file);

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

    return (
        <div className='border-round-xl bg-white border-1 border-solid border-300 relative'>
            <input
                type='file'
                accept={accept}
                ref={inputRef}
                value=''
                multiple={multiple}
                hidden={true}
                onChange={(e) => {
                    if (!e.target.files) {
                        return;
                    }

                    let result: FileType[] = [];

                    forEach(e.target.files, (file) => {
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
                        <div className='flex align-items-center gap-3 col-3 py-3' key={file.name + file.type}>
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
