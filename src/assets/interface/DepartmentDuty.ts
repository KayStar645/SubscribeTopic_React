import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { FileType } from '@assets/types/form';

interface DepartmentDutyType extends GeneralType {
    departmentId?: number;
    teacherId?: number;
    numberOfThesis?: number;
    timeStart?: Date;
    timeEnd?: Date;
    image?: FileType;
    file?: FileType;
}

interface DepartmentDutyParamType extends ParamType {
    departmentId: number;
}

export type { DepartmentDutyType, DepartmentDutyParamType };
