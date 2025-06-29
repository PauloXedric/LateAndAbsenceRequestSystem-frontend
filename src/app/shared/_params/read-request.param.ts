import { RequestStatusEnum } from '@shared/_enums';

export interface ReadRequestParams {
  statusId: RequestStatusEnum;
  pageNumber: number;
  pageSize: number;
  filter?: string;
}
