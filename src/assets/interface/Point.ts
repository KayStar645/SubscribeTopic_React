import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { StudentType, TeacherType } from '.';

interface PointType extends GeneralType {
    scores?: {
        pointId: number;
        score: number;
        teacher: TeacherType;
    }[];
    averageScore?: number;
    studentJoin?: {
        student: StudentType;
    };
}

interface PointParamType extends ParamType {
    isGetThesisCurrentMe?: boolean;
    thesisId?: number;
}

export type { PointParamType, PointType };
