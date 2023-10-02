import { ParamType } from '@assets/types/request';
import { Default } from './Default';

interface FacultyType extends Default {
    address?: string;
    phoneNumber?: string;
    email?: string;
    dean_TeacherId?: string;
}

interface FacultyParamType extends ParamType {
    isGetDepartment?: boolean;
    isGetDean?: boolean;
    isAllDetail?: boolean;
}

export type { FacultyType, FacultyParamType };
