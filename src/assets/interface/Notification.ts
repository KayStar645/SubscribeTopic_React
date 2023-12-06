import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface NotificationType extends GeneralType {
    describe?: string;
    content?: string;
    image?: string;
    images?: string[];
}

interface NotificationParamType extends ParamType {}

export type { NotificationParamType, NotificationType };
