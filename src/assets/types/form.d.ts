import { ChangeEvent, ChangeEventHandler, FocusEventHandler, PropsWithChildren } from 'react';
import * as yup from 'yup';
import { OptionType } from './common';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';

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
    id?: string;
    value?: string | number;
    label?: string;
    placeholder?: string;
    blockClassName?: string;
    errorMessage?: string;
    row?: boolean;
    required?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
}

interface InputTextProps extends InputProps {}

interface InputPasswordProps extends InputProps {}

interface CheckboxProps extends InputProps {
    value?: boolean;
    onChange?: (e: CheckboxChangeEvent) => void;
}

interface DropdownProps extends InputProps {
    options?: OptionType[];
    optionValue?: string;
    emptyMessage?: string;
    onChange?: (e: string) => void;
}

interface TextAreaProps extends InputProps {
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface RadioListProps extends InputProps {
    id?: string;
    options: OptionType[];
    onChange?: (e: RadioButtonChangeEvent) => void;
}

interface InputDateProps extends InputProps {
    value?: Date | null;
    format?: string;
    time?: boolean;
    onChange?: (e: FormEvent<Date, SyntheticEvent<Element, Event>>) => void;
}

interface EditorProps extends InputProps {
    onChange?: (e: string) => void;
}

export default FormType;
export type {
    CheckboxProps,
    InputTextProps,
    InputPasswordProps,
    DropdownProps,
    TextAreaProps,
    RadioListProps,
    InputDateProps,
    EditorProps,
};
