import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface ThesisType extends GeneralType {
    summary?: string;
    minQuantity?: number;
    maxQuantity?: number;
    thesisInstructionsId?: number[];
    thesisMajorsId?: number[];
}

interface ThesisParamType extends ParamType {
    isGetIssuer?: boolean;
    isGetThesisInstructions?: boolean;
    isGetThesisReviews?: boolean;
    isGetThesisMajors?: boolean;
    departmentId?: boolean;
}

export type { ThesisType, ThesisParamType };
