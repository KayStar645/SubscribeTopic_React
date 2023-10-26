import { RadioListProps } from '@assets/types/form';
import { RadioButton as PrimeRadioButton } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

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

                <div className='flex gap-5 align-items-center' style={{ height: 55 }}>
                    {options.map((t) => {
                        return (
                            <div key={t.value} className='flex align-items-center gap-2'>
                                <PrimeRadioButton
                                    inputId={t.value?.toString()}
                                    value={t.value}
                                    checked={t.value === current}
                                    onChange={(e) => {
                                        setCurrent(t.value);
                                        onChange(e);
                                    }}
                                />

                                <label htmlFor={t.value?.toString()}>{t.label}</label>
                            </div>
                        );
                    })}
                </div>
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { RadioList };
