import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface RegistrationPeriodType extends GeneralType {
    semester?: 'Học kỳ 1' | 'Học kỳ 2' | 'Học kỳ 3';
    timeStart?: Date | null;
    timeEnd?: Date | null;
    phase?: string;
}

interface RegistrationPeriodParamType extends ParamType {}

export type { RegistrationPeriodParamType, RegistrationPeriodType };
