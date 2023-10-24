import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface DepartmentType extends GeneralType {
    facultyId?: string;
}

interface DepartmentParamType extends ParamType {
    facultyId?: string | number;
    isGetHeadDepartment?: boolean;
    isGetFaculty?: boolean;
}

export type { DepartmentType, DepartmentParamType };
