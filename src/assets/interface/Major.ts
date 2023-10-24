import { ParamType } from '@assets/types/request';
import { Default } from './Default';

interface MajorType extends Default {
    industryId?: string;
}

interface MajorParamType extends ParamType {
    isGetIndustry?: boolean;
    isGetDean?: boolean;
    facultyId?: string | number;
    industryId?: string | number;
}

export type { MajorParamType, MajorType };
