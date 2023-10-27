import { InputDateProps } from '@assets/types/form';
import { Calendar as PrimeCalendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';

const InputDate = ({
    id,
    label,
    value = undefined,
    placeholder = '',
    blockClassName = '',
    format = 'dd/mm/yy',
    row = false,
    time = false,
    required = false,
    errorMessage,
    onChange = () => {},
}: InputDateProps) => {
    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
                {label && (
                    <label
                        htmlFor={id}
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
                <PrimeCalendar
                    inputId={id}
                    locale='vi'
                    hideOnDateTimeSelect={true}
                    value={value ? new Date(value) : null}
                    placeholder={placeholder}
                    onChange={onChange}
                    dateFormat={format}
                    className={classNames('w-full flex-1', { 'p-invalid': !!errorMessage })}
                    inputClassName='w-full p-3'
                    showTime={time}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { InputDate };
