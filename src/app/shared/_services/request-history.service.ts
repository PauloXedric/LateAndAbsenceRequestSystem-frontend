import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import {
  PaginatedResult,
  RequestHistoryCreateModel,
  RequestHistoryReadModel,
} from '@shared/_models';
import { ReadRequestHistoryParam } from '@shared/_params';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestHistoryService {
  constructor(private api: ApiService) {}

  addRequestHistory(data: RequestHistoryCreateModel): Observable<boolean> {
    return this.api.post<boolean>('RequestHistory', data);
  }

  getAllRequestHistory(
    params: ReadRequestHistoryParam
  ): Observable<PaginatedResult<RequestHistoryReadModel>> {
    return this.api.get<PaginatedResult<RequestHistoryReadModel>>(
      'RequestHistory',
      params
    );
  }
}
