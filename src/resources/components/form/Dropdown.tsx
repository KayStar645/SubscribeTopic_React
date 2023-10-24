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
    isRow = false,
    errorMessage,
    onChange = () => {},
    onSelect = () => {},
}: DropdownProps) => {
    const [selected, setSelected] = useState(value);

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames({ 'flex align-items-center': isRow })}>
                {label && (
                    <label
                        htmlFor={id}
                        className={classNames('text-900 font-medium block', {
                            'w-10rem mr-2': isRow,
                            'mb-2': !isRow,
                        })}
                    >
                        {label}
                    </label>
                )}

                <PrimeDropdown
                    options={options}
                    value={selected}
                    optionValue='value'
                    placeholder={placeholder}
                    className={classNames('w-full', { 'p-invalid': !!errorMessage })}
                    onChange={(e) => {
                        onChange(e.value);
                        setSelected(e.value);
                        onSelect(options.find((t) => t.code === e.value));
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { Dropdown };
