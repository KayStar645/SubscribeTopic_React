import { ParamType } from '@assets/types/request';
import { Default } from './Default';

interface FacultyType extends Default {
    dean_TeacherId?: string;
}

interface FacultyParamType extends ParamType {
    isGetDepartment?: boolean;
    isGetDean?: boolean;
}

export type { FacultyType, FacultyParamType };
