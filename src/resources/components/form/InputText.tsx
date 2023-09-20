import { InputTextProps } from '@assets/types/form';
import { InputText as PrimeInputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

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
					value={value}
					placeholder={placeholder}
					spellCheck={false}
					className={classNames('w-full flex-1 p-3', { 'p-invalid': !!errorMessage })}
					onChange={onChange}
					onBlur={onBlur}
				/>
			</div>

			<small className='p-error'>{errorMessage}</small>
		</div>
	);
};

export { InputText };
