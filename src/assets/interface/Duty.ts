import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { FileType } from '@assets/types/form';

interface DutyType extends GeneralType {
    content?: string;
    numberOfThesis?: number;
    timeStart?: Date | null;
    timeEnd?: Date | null;
    periodId?: number;
    files?: FileType[];
    departmentId?: number;
}

interface DutyParamType extends ParamType {
    departmentId?: number;
}

export type { DutyType, DutyParamType };
