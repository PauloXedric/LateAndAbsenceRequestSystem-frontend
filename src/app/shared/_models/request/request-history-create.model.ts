import { RequestResultEnum } from '@shared/_enums';

export interface RequestHistoryCreateModel {
  actionDate?: Date;
  requestId: number;
  resultId: RequestResultEnum;
  performedByUserId?: string;
}
