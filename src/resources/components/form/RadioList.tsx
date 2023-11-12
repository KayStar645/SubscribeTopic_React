import { OptionType } from '@assets/types/common';
import { RadioListProps } from '@assets/types/form';
import { RadioButton as PrimeRadioButton } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';

const RadioList = ({
    label,
    value = '',
    blockClassName = '',
    row = false,
    required = false,
    errorMessage,
    options = [],
    onChange = () => {},
}: RadioListProps) => {
    const [current, setCurrent] = useState<string | number | undefined>(value.toString());

    useEffect(() => {
        setCurrent(value);
    }, [value]);

    const Item = (data: OptionType) => {
        return (
            <div key={data.value} className='flex align-items-center gap-2'>
                <PrimeRadioButton
                    inputId={data.value?.toString()}
                    value={data.value}
                    checked={data.value === current}
                    onChange={(e) => {
                        setCurrent(data.value);
                        onChange(e);
                    }}
                />

                <label htmlFor={data.value?.toString()}>{data.label}</label>
            </div>
        );
    };

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
                {label && (
                    <label
                        className={classNames('font-medium block', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                            'p-error': !!errorMessage,
                        })}
                    >
                        {label}
                        {required && <span className='p-error'> ⁎</span>}
                    </label>
                )}

                <div className='flex gap-5 align-items-center h-3rem'>{options.map(Item)}</div>
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { RadioList };
