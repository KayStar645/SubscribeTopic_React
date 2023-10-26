import { TextAreaProps } from '@assets/types/form';
import { InputTextarea as PrimeInputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

const InputTextArea = ({
    id,
    label,
    value = '',
    placeholder = '',
    blockClassName = '',
    row = false,
    errorMessage,
    onChange,
}: TextAreaProps) => {
    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames({ 'flex align-items-center': row })}>
                {label && (
                    <label
                        htmlFor={id}
                        className={classNames('text-900 font-medium block', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                        })}
                    >
                        {label}
                    </label>
                )}

                <PrimeInputTextarea
                    value={value.toString()}
                    placeholder={placeholder}
                    className={classNames('w-full', { 'p-invalid': !!errorMessage })}
                    onChange={(e) => {
                        onChange?.(e);
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { InputTextArea };
