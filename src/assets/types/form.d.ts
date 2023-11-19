import { CheckboxChangeEvent } from 'primereact/checkbox';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { ChangeEvent, ChangeEventHandler, FocusEventHandler } from 'react';
import { OptionType } from './common';
import { MultiSelectChangeEvent } from 'primereact/multiselect';

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
    onChange?: (_e: CheckboxChangeEvent) => void;
}

interface DropdownProps extends InputProps {
    options?: OptionType[];
    optionValue?: string;
    emptyMessage?: string;
    onChange?: (_e: string) => void;
}

interface MultiSelectProps extends InputProps {
    value?: any[];
    options?: OptionType[];
    optionValue?: string;
    emptyMessage?: string;
    onChange?: (_e: MultiSelectChangeEvent) => void;
}

interface TextAreaProps extends InputProps {
    onChange?: (_e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface RadioListProps extends InputProps {
    id?: string;
    options: OptionType[];
    onChange?: (_e: RadioButtonChangeEvent) => void;
}

interface InputDateProps extends InputProps {
    value?: Date | null;
    format?: string;
    time?: boolean;
    onChange?: (_e: FormEvent<Date, SyntheticEvent<Element, Event>>) => void;
}

interface EditorProps extends InputProps {
    onChange?: (_e: string) => void;
}

interface EditorProps extends InputProps {
    onChange?: (_e: string) => void;
}

interface InputRangeProps extends InputProps {
    min?: number;
    max: number;
    minPlaceHolder?: string;
    maxPlaceHolder?: string;
    value?: [number?, number?];
    onChange?: (_e: [number, number]) => void;
}

export type {
    CheckboxProps,
    DropdownProps,
    EditorProps,
    InputDateProps,
    InputPasswordProps,
    InputRangeProps,
    InputTextProps,
    MultiSelectProps,
    RadioListProps,
    TextAreaProps,
};
