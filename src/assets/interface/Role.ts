import { ParamType } from '@assets/types/request';
import { GeneralType } from './Default';

interface RoleType extends GeneralType {
    permissionsName?: string[];
}

interface RoleParamType extends ParamType {}

export type { RoleType, RoleParamType };
