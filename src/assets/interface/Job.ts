import { ParamType } from '@assets/types/request';
import { GeneralType, TeacherType } from '.';
import { FileType } from '@assets/types/form';

interface JobType extends GeneralType {
    instructions?: string;
    due?: Date;
    files?: FileType[];
    lastModifiedDate?: Date;
    teacherBy?: TeacherType;
    thesisId?: number;
}

interface JobParamType extends ParamType {
    thesisId?: number;
}

export type { JobParamType, JobType };
