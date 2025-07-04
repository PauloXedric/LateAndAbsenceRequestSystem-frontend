import { UserRoleEnum } from '@features/_enums/roles.enum';
import { UserStatusEnum } from '@features/_enums/user-status.enum';

export interface UserUpdateModel {
  userCode: string;
  role: UserRoleEnum;
  status: UserStatusEnum;
}
