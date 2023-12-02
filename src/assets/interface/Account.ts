import { StudentType, TeacherType } from '.';

interface AccountType {
    id?: string | number;
    userName?: string;
    type?: '';
    teacher?: TeacherType;
    student?: StudentType;
    roles?: string[];
}

export type { AccountType };
