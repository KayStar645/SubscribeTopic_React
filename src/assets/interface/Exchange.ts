import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { StudentType, TeacherType } from '.';

interface ExchangeType extends GeneralType {
    content: string;
    jobId: number;
    lastModifiedDate: Date;
    student: StudentType;
    teacher: TeacherType;
}

interface ExchangeParamType extends ParamType {
    jobId: number;
}

export type { ExchangeType, ExchangeParamType };
