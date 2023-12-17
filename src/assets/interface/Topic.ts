import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';
import { GroupType, MajorType, TeacherType } from '.';

interface TopicType extends GeneralType {
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
    status?: 'A' | 'AR' | 'D';
    groupDto?: GroupType;
    dutyId?: number;
}

interface TopicParamType extends ParamType {
    id?: number | string;
    isGetIssuer?: boolean;
    isGetThesisInstructions?: boolean;
    isGetThesisReviews?: boolean;
    isGetThesisMajors?: boolean;
    departmentId?: boolean;
}

export type { TopicType, TopicParamType };
