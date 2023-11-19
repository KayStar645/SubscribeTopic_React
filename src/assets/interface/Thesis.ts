import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { MajorType, TeacherType } from '.';

interface ThesisType extends GeneralType {
    summary?: string;
    minQuantity?: number;
    maxQuantity?: number;
    thesisReviewsId?: number[];
    thesisReviews?: TeacherType[];
    thesisInstructionsId?: number[];
    thesisMajorsId?: number[];
    thesisInstructions?: TeacherType[];
    thesisMajors?: MajorType[];
    lecturerThesis?: TeacherType;
}

interface ThesisParamType extends ParamType {
    id?: number | string;
    isGetIssuer?: boolean;
    isGetThesisInstructions?: boolean;
    isGetThesisReviews?: boolean;
    isGetThesisMajors?: boolean;
    departmentId?: boolean;
}

export type { ThesisType, ThesisParamType };
