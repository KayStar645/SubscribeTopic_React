import { PropsWithChildren } from 'react';
import * as yup from 'yup';
import { OptionType } from './common';

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
	blockClassName?: string;
	placeholder?: string;
	errorMessage?: string;
	isRow?: boolean;
	onChange?: (e) => void;
	onBlur?: (e) => void;
}

interface InputTextProps extends InputProps {
	value?: string;
}

interface InputPasswordProps extends InputProps {
	value?: string;
}

interface CheckboxProps extends InputProps {
	value?: boolean;
}

interface DropdownProps extends InputProps {
	value?: string;
	options: OptionType[];
	onSelect?: (option: OptionType) => void;
}

export default FormType;
export type { CheckboxProps, InputTextProps, InputPasswordProps, DropdownProps };
