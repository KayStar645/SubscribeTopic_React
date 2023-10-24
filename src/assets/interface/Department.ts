import { ParamType } from '@assets/types/request';
import { Default } from './Default';

interface DepartmentType extends Default {
    facultyId?: string;
}

interface DepartmentParamType extends ParamType {
    facultyId?: string | number;
    isGetHeadDepartment?: boolean;
    isGetFaculty?: boolean;
}

export type { DepartmentType, DepartmentParamType };
