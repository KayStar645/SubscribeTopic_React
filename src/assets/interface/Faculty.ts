import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface FacultyType extends GeneralType {
    dean_TeacherId?: string;
}

interface FacultyParamType extends ParamType {
    isGetDepartment?: boolean;
    isGetDean?: boolean;
}

export type { FacultyType, FacultyParamType };
