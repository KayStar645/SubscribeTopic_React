import { ParamType } from '@assets/types/request';
import { Default } from './Default';

interface IndustryType extends Default {
    facultyId?: string | number;
}

interface IndustryParamType extends ParamType {
    isGetFaculty?: boolean;
    facultyId?: number | string;
}

export type { IndustryParamType, IndustryType };
