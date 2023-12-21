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
    disabled = false,
    emptyMessage = 'No results found',
    errorMessage,
    onChange = () => {},
}: MultiSelectProps) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        if (value && value.length > 0) {
            setInputValue(value);
        }
    }, [value]);

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
                    disabled={disabled}
                    dataKey={Math.random().toString()}
                    emptyMessage={emptyMessage}
                    inputId={id}
                    options={options}
                    value={inputValue}
                    optionValue={optionValue}
                    filter={true}
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
