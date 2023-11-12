import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface TeacherType extends GeneralType {
    departmentId?: number | string;
    gender?: string;
    dateOfBirth: Date | null;
    academicTitle?: string;
    degree?: string;
    type?: string;
}

interface TeacherParamType extends ParamType {
    type?: string;
    departmentId?: string | number;
}

export type { TeacherType, TeacherParamType };
