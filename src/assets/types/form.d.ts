import { ChangeEvent, ChangeEventHandler, FocusEventHandler, PropsWithChildren } from 'react';
import * as yup from 'yup';
import { OptionType } from './common';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';

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

interface EditorProps extends InputProps {
    onChange?: (e: string) => void;
}

interface InputRangeProps extends InputProps {
    min?: number;
    max: number;
    minPlaceHolder?: string;
    maxPlaceHolder?: string;
    value?: [number, number];
    onChange?: (e: [number, number]) => void;
}

export type {
    CheckboxProps,
    InputTextProps,
    InputPasswordProps,
    DropdownProps,
    TextAreaProps,
    RadioListProps,
    InputDateProps,
    EditorProps,
    InputRangeProps,
};
