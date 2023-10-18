import { InputTextProps } from '@assets/types/form';
import { InputText as PrimeInputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

const InputText = ({
    id,
    label,
    value = '',
    placeholder = '',
    blockClassName = '',
    isRow = false,
    errorMessage,
    onChange = () => {},
    onBlur = () => {},
}: InputTextProps) => {
    const [inputValue, setInputValue] = useState(value);

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': isRow })}>
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
                <PrimeInputText
                    id={id}
                    value={inputValue}
                    placeholder={placeholder}
                    spellCheck={false}
                    className={classNames('w-full flex-1 p-3', { 'p-invalid': !!errorMessage })}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange(e);
                    }}
                    onBlur={(e) => {
                        setInputValue(e.target.value);
                        onBlur(e);
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { InputText };
