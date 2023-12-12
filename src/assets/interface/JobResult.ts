import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { FileType } from '@assets/types/form';
import { StudentType } from '.';

interface JobResultType extends GeneralType {
    files?: FileType[];
    jobId?: number;
    studentBy?: StudentType;
    lastModifiedDate?: Date;
}

interface JobResultParamType extends ParamType {
    jobId: number;
    studentId?: number;
    isGetStudentBy: boolean;
}

export type { JobResultParamType, JobResultType };
