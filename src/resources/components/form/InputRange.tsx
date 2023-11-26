'use client';

import { InputRangeProps } from '@assets/types/form';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';

const InputRange = ({
    id,
    label,
    value = [0, 0],
    blockClassName = '',
    minPlaceHolder = 'min',
    maxPlaceHolder = 'max',
    row = false,
    disabled = false,
    required = false,
    min,
    max,
    onChange = () => {},
}: InputRangeProps) => {
    const [_value, setValue] = useState<[number?, number?]>(value || [0, 0]);

    useEffect(() => {
        setValue(value);
    }, [value]);

    return (
        <div className={classNames('w-fit', blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
                {label && (
                    <label
                        htmlFor={id}
                        className={classNames('font-medium block text-800', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                        })}
                    >
                        {label}
                        {required && <span className='p-error'> ⁎</span>}
                    </label>
                )}

                <div className='flex align-items-center'>
                    <InputNumber
                        disabled={disabled}
                        inputClassName='w-6rem h-3rem text-center'
                        min={min}
                        useGrouping={false}
                        placeholder={minPlaceHolder}
                        value={_value[0] || 0}
                        onChange={(e) => {
                            const nValue: [number, number] = [e.value || 0, _value[1] || 0];

                            setValue(nValue);
                            onChange(nValue);
                        }}
                    />

                    <Divider />

                    <InputNumber
                        disabled={disabled}
                        inputClassName='w-6rem h-3rem text-center'
                        max={max}
                        value={_value[1] || 0}
                        useGrouping={false}
                        placeholder={maxPlaceHolder}
                        onChange={(e) => {
                            const nValue: [number, number] = [_value[0] || 0, e.value || 0];

                            setValue(nValue);
                            onChange(nValue);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export { InputRange };
