import { ParamType } from '@assets/types/request';
import { Default } from './Default';

interface TeacherType extends Default {
    departmentId: number;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    email: string;
    academicTitle: string;
    degree: string;
    type: string;
}

interface TeacherParamType extends ParamType {
    facultyId?: string;
}

export type { TeacherType, TeacherParamType };