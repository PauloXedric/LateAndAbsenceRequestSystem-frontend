import { RequestStatusEnum } from '@shared/_enums';

export interface RequestUpdateModel {
  requestId: number;
  statusId: RequestStatusEnum;
}
