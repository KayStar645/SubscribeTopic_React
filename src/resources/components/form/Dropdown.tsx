import { DropdownType } from '@assets/types/form';
import { Dropdown as PrimeDropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

const Dropdown = ({
	id,
	label,
	value,
	defaultIndex,
	options,
	placeholder = '',
	blockClassName = '',
	isRow = false,
	errorMessage,
	onChange = () => {},
}: DropdownType) => {
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
					placeholder={placeholder}
					className='w-full md:w-14rem'
					onChange={(e) => {
						onChange(e);
						setSelected(e.value);
					}}
				/>
			</div>

			<small className='p-error'>{errorMessage}</small>
		</div>
	);
};

export { Dropdown };
