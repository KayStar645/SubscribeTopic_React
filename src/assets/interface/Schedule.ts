import { ParamType } from '@assets/types/request';
import { GeneralType, TopicType } from '.';

interface ScheduleType extends GeneralType {
    timeStart?: Date | null;
    timeEnd?: Date | null;
    location?: string;
    type?: 'W' | 'R';
    thesisId?: number;
    thesis?: TopicType;
}

interface ScheduleParamType extends ParamType {}

export type { ScheduleParamType, ScheduleType };
