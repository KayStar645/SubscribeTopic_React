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
    type: string;
    teacherId?: number;
}

interface DutyParamType extends ParamType {
    departmentId?: number;
    type: 'F' | 'D';
}

export type { DutyType, DutyParamType };
