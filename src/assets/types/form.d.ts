import { PropsWithChildren } from 'react';
import * as yup from 'yup';
import { OptionType } from './common';

type FormType = PropsWithChildren<{
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
}>;

interface InputType {
	id: string;
	label?: string;
	blockClassName?: string;
	placeholder?: string;
	errorMessage?: string;
	isRow?: boolean;
	onChange?: (e) => void;
	onBlur?: (e) => void;
}

type InputTextType = InputType & {
	value?: string;
};

type PasswordType = InputType & {
	value?: string;
};

type CheckboxType = InputType & {
	value?: boolean;
};

type DropdownType = InputType & {
	value?: string;
	options: OptionType[];
	defaultIndex?: number;
	onSelect?: (option: OptionType) => void;
};

export default FormType;
export { CheckboxType, InputTextType, PasswordType, DropdownType };
