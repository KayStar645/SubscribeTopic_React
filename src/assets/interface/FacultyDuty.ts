import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { DepartmentType } from '.';

interface FacultyDutyType extends GeneralType {
    facultyId?: string;
    departmentId?: number;
    department?: DepartmentType;
    numberOfThesis?: string | number;
    timeStart?: Date | null;
    timeEnd?: Date | null;
    image?: string[];
    file?: string[];
}

interface FacultyDutyParamType extends ParamType {
    isGetDepartment?: boolean;
    isGetFaculty?: boolean;
}

export type { FacultyDutyType, FacultyDutyParamType };
