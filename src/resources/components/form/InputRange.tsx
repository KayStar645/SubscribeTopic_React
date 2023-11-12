import { InputRangeProps } from '@assets/types/form';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

const InputRange = ({
    id,
    label,
    value = [0, 0],
    blockClassName = '',
    minPlaceHolder = 'min',
    maxPlaceHolder = 'max',
    row = false,
    required = false,
    min = 1,
    max,
    onChange = () => {},
}: InputRangeProps) => {
    const [_min, setMin] = useState<number | null>(value[0] || 0);
    const [_max, setMax] = useState<number | null>(value[1] || 0);

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
                {label && (
                    <label
                        htmlFor={id}
                        className={classNames('font-medium block', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                        })}
                    >
                        {label}
                        {required && <span className='p-error'> ⁎</span>}
                    </label>
                )}

                <div className='flex align-items-center'>
                    <InputNumber
                        min={min}
                        useGrouping={false}
                        placeholder={minPlaceHolder}
                        value={_min}
                        onChange={(e) => {
                            setMin(e.value);
                            onChange([e.value!, _max!]);
                        }}
                    />

                    <Divider />

                    <InputNumber
                        max={max}
                        useGrouping={false}
                        placeholder={maxPlaceHolder}
                        onChange={(e) => {
                            setMax(e.value);
                            onChange([_min!, e.value!]);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export { InputRange };
