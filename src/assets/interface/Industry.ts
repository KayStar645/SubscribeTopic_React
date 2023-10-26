import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface IndustryType extends GeneralType {
    facultyId?: string | number;
}

interface IndustryParamType extends ParamType {
    isGetFaculty?: boolean;
}

export type { IndustryParamType, IndustryType };
