import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { DepartmentType } from '.';

interface TeacherType extends GeneralType {
    departmentId?: number | string;
    gender?: string;
    dateOfBirth: Date | null;
    academicTitle?: string;
    degree?: string;
    type?: string;
    department?: DepartmentType;
}

interface TeacherParamType extends ParamType {
    type?: string;
    departmentId?: string | number;
}

export type { TeacherType, TeacherParamType };
