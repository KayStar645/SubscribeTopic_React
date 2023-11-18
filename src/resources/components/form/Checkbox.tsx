import { CheckboxProps } from '@assets/types/form';
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';

const Checkbox = ({
    id = '',
    label = '',
    blockClassName = '',
    placeholder,
    value = false,
    errorMessage,
    onChange = () => {},
    ...props
}: CheckboxProps) => {
    return (
        <div className={classNames(blockClassName)} {...props}>
            <div className={classNames('flex align-items-center')}>
                <PrimeCheckbox
                    inputId={id}
                    placeholder={placeholder}
                    className={classNames('mr-2', { 'p-invalid': !!errorMessage })}
                    checked={value}
                    onChange={onChange}
                ></PrimeCheckbox>

                {label && (
                    <label htmlFor={id} className='font-medium block text-800'>
                        {label}
                    </label>
                )}
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { Checkbox };
