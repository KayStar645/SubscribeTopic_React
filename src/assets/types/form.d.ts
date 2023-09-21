import { ChangeEventHandler, FocusEventHandler, PropsWithChildren } from 'react';
import * as yup from 'yup';
import { OptionType } from './common';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { CheckboxChangeEvent } from 'primereact/checkbox';

interface FormType extends PropsWithChildren {
	headers?: Record<string, string>;
	validateStatus?: (status: number) => boolean;
	onError?: ({
		response,
		error,
	}:
		| {
				response: Response;
				error?: undefined;
		  }
		| {
				response?: undefined;
				error: unknown;
		  }) => void;
	onSuccess?: ({ response }: { response: Response }) => void;
	onSubmit?: (data) => void;
	method?: 'post' | 'put' | 'delete';
	schema: yup.ObjectSchema;
}

interface InputProps {
	id: string;
	label?: string;
	value?: string;
	blockClassName?: string;
	placeholder?: string;
	errorMessage?: string;
	isRow?: boolean;
	onChange?: (e: ChangeEventHandler<HTMLInputElement>) => void;
	onBlur?: (e: FocusEventHandler<HTMLInputElement>) => void;
}

interface InputTextProps extends InputProps {}

interface InputPasswordProps extends InputProps {}

interface CheckboxProps extends InputProps {
	value?: boolean;
	onChange?: (e: CheckboxChangeEvent) => void;
}

interface DropdownProps extends InputProps {
	options: OptionType[];
	onChange?: (e: DropdownChangeEvent) => void;
	onSelect?: (option: OptionType | undefined) => void;
}

export default FormType;
export type { CheckboxProps, InputTextProps, InputPasswordProps, DropdownProps };
