import { InputDateProps } from '@assets/types/form';
import { Calendar as PrimeCalendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';

const InputDate = ({
    id,
    label,
    value = null,
    placeholder = '',
    blockClassName = '',
    format = 'dd/mm/yy',
    row = false,
    time = false,
    required = false,
    errorMessage,
    onChange = () => {},
}: InputDateProps) => {
    const [date, setDate] = useState<Date | undefined | null>(value ? new Date(value) : null);

    useEffect(() => {
        if (value) {
            setDate(new Date(value));
        }
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
                <PrimeCalendar
                    inputId={id}
                    locale='vi'
                    hideOnDateTimeSelect={true}
                    value={date}
                    hourFormat='24'
                    placeholder={placeholder}
                    onChange={onChange}
                    dateFormat={format}
                    className={classNames('w-full flex-1', { 'p-invalid': !!errorMessage })}
                    inputClassName='w-full h-3rem'
                    showTime={time}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { InputDate };
