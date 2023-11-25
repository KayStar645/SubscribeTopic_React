'use client';

import { DropdownProps } from '@assets/types/form';
import { Dropdown as PrimeDropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

const Dropdown = ({
    id,
    label,
    value,
    options,
    placeholder = '',
    blockClassName = '',
    row = false,
    optionValue = 'value',
    emptyMessage = 'No results found',
    errorMessage,
    showClear = false,
    onChange = () => {},
}: DropdownProps) => {
    const [selected, setSelected] = useState(value);

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames({ 'flex align-items-center': row })}>
                {label && (
                    <label
                        htmlFor={id}
                        className={classNames('text-900 font-medium block text-800', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                        })}
                    >
                        {label}
                    </label>
                )}

                <PrimeDropdown
                    showClear={showClear}
                    emptyMessage={emptyMessage}
                    inputId={id}
                    options={options}
                    value={selected}
                    optionValue={optionValue}
                    placeholder={placeholder}
                    className={classNames('w-full', { 'p-invalid': !!errorMessage })}
                    onChange={(e) => {
                        onChange(e.value);
                        setSelected(e.value);
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { Dropdown };
