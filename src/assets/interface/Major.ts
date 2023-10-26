import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface MajorType extends GeneralType {
    industryId?: string;
}

interface MajorParamType extends ParamType {
    isGetIndustry?: boolean;
    isGetDean?: boolean;
    industryId?: string | number;
}

export type { MajorParamType, MajorType };
