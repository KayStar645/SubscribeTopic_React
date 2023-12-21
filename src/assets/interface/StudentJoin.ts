import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface StudentJoinType extends GeneralType {
    studentIds?: number[];
    registrationPeriodId?: string | number;
    score?: number;
}

interface StudentJoinParamType extends ParamType {
    isGetStudent?: boolean;
    isGetRegistrationPeriod?: boolean;
    industryId?: string | number;
    majorId?: string | number;
    periodId?: string | number;
}

export type { StudentJoinParamType, StudentJoinType };
