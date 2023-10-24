import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface MajorType extends GeneralType {
    industryId?: string;
}

interface MajorParamType extends ParamType {
    isGetIndustry?: boolean;
    isGetDean?: boolean;
    facultyId?: string | number;
    industryId?: string | number;
}

export type { MajorParamType, MajorType };
