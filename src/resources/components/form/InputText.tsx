'use client';

import { InputTextProps } from '@assets/types/form';
import { InputText as PrimeInputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';

const InputText = ({
    id,
    label,
    value = '',
    placeholder = '',
    blockClassName = '',
    row = false,
    required = false,
    disabled = false,
    errorMessage,
    onChange = () => {},
    onBlur = () => {},
}: InputTextProps) => {
    const [inputValue, setInputValue] = useState(value ? value.toString() : '');

    useEffect(() => {
        setInputValue(value ? value.toString() : '');
    }, [value]);

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
                {label && (
                    <label
                        htmlFor={id}
                        className={classNames('font-medium block text-800', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                            'p-error': !!errorMessage,
                        })}
                    >
                        {label}
                        {required && <span className='p-error'> ⁎</span>}
                    </label>
                )}
                <PrimeInputText
                    id={id}
                    value={inputValue}
                    placeholder={placeholder}
                    spellCheck={false}
                    disabled={disabled}
                    style={{ height: '47px' }}
                    autoComplete='false'
                    className={classNames('w-full flex-1 px-3', { 'p-invalid': !!errorMessage })}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange(e);
                    }}
                    onBlur={(e) => {
                        setInputValue(e.target.value);
                        onBlur(e);
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { InputText };
