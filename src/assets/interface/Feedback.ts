import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface FeedbackType extends GeneralType {
    content?: string;
    dateCreated?: Date;
    commenter: {
        name?: string;
    };
}

interface FeedbackParamType extends ParamType {
    thesisId?: string;
}

export type { FeedbackType, FeedbackParamType };
