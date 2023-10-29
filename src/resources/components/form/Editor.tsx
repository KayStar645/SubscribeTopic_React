import { EditorProps } from '@assets/types/form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';
import { default as EditorContainer } from 'ckeditor5-custom-build';

const Editor = ({
    label,
    value = '',
    blockClassName = '',
    row = false,
    required = false,
    errorMessage,
    onChange = () => {},
}: EditorProps) => {
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
                {label && (
                    <p
                        className={classNames('font-medium block', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                            'p-error': !!errorMessage,
                        })}
                    >
                        {label}
                        {required && <span className='p-error'> ⁎</span>}
                    </p>
                )}

                <CKEditor
                    editor={EditorContainer}
                    data={inputValue}
                    onChange={(event, editor) => {
                        const data = editor.getData();

                        onChange(data);
                        setInputValue(data);
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { Editor };
