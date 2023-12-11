'use client';

import { InputNumberProps } from '@assets/types/form';
import { InputNumber as PrimeInputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';

const InputNumber = ({
    id,
    label,
    value = 1,
    placeholder = '',
    blockClassName = '',
    min = 1,
    max,
    row = false,
    required = false,
    disabled = false,
    errorMessage,
    onChange = () => {},
}: InputNumberProps) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
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
                <PrimeInputNumber
                    id={id}
                    value={inputValue}
                    placeholder={placeholder}
                    spellCheck={false}
                    min={min}
                    max={max}
                    useGrouping={true}
                    disabled={disabled}
                    style={{ height: '47px' }}
                    inputClassName='px-3'
                    className={classNames('w-full flex-1', { 'p-invalid': !!errorMessage })}
                    onValueChange={(e) => {
                        if (e.value) {
                            setInputValue(e.value);
                            onChange(e.value);
                        }
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { InputNumber };
