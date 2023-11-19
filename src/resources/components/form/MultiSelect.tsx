import { MultiSelectProps } from '@assets/types/form';
import { MultiSelect as PrimeMultiSelect } from 'primereact/multiselect';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';

const MultiSelect = ({
    id,
    label,
    value = [],
    options,
    placeholder = '',
    blockClassName = '',
    row = false,
    optionValue = 'value',
    emptyMessage = 'No results found',
    errorMessage,
    onChange = () => {},
}: MultiSelectProps) => {
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

                <PrimeMultiSelect
                    emptyMessage={emptyMessage}
                    inputId={id}
                    options={options}
                    value={value}
                    optionValue={optionValue}
                    placeholder={placeholder}
                    display='chip'
                    className={classNames('w-full', { 'p-invalid': !!errorMessage })}
                    onChange={(e) => {
                        onChange(e);
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { MultiSelect };
