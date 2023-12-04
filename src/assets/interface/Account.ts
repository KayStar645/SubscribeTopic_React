import { StudentType, TeacherType } from '.';

interface AccountType {
    id?: string | number;
    userName?: string;
    type?: '';
    teacher?: TeacherType;
    student?: StudentType;
    roles?: {
        id: number;
        name: string;
    }[];
}

export type { AccountType };
