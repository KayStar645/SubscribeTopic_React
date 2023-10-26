import { InputPasswordProps } from '@assets/types/form';
import { Password as PrimePassword } from 'primereact/password';
import { classNames } from 'primereact/utils';

const Password = ({
    id,
    label,
    value = '',
    placeholder = '',
    blockClassName = '',
    row = false,
    errorMessage,
    onChange = () => {},
    onBlur = () => {},
}: InputPasswordProps) => {
    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
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
                <PrimePassword
                    inputId={id}
                    value={value}
                    placeholder={placeholder}
                    spellCheck={false}
                    className={classNames('w-full flex-1', { 'p-invalid': !!errorMessage })}
                    inputClassName='w-full p-3'
                    toggleMask={true}
                    feedback={false}
                    onChange={onChange}
                />
            </div>
            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { Password };
