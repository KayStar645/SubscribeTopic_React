import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { FileType } from '@assets/types/form';

interface DepartmentDutyType extends GeneralType {
    content?: string;
    numberOfThesis?: number;
    timeEnd?: Date | null;
    files?: FileType[];
    teacherId?: number;
    dutyId?: number;
}

interface DepartmentDutyParamType extends ParamType {}

export type { DepartmentDutyType, DepartmentDutyParamType };
