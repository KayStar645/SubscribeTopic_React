import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { TeacherType } from '.';

interface CouncilType extends GeneralType {
    location?: string;
    commissioners?: {
        position: string;
        teacherId: number;
        teacher?: TeacherType;
    }[];
}

interface CouncilParamType extends ParamType {}

export type { CouncilType, CouncilParamType };
