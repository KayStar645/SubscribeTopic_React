import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { TeacherType } from '.';

interface DepartmentType extends GeneralType {
    facultyId?: string;
    headDepartment_Teacher?: TeacherType;
    headDepartment_TeacherId?: number;
}

interface DepartmentParamType extends ParamType {
    isGetHeadDepartment?: boolean;
    isGetFaculty?: boolean;
}

export type { DepartmentType, DepartmentParamType };
