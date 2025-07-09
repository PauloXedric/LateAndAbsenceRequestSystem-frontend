import { Injectable } from '@angular/core';
import { RequestReadModel } from '../_models/request/request-read.model';
import { PaginatedResult } from '../_models/paginated-result.model';
import { ReadRequestParams } from '../_params/read-request.param';
import { RequestUpdateModel } from '../_models/request/request-update.model';
import { ApiService } from '@core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private api: ApiService) {}

  getAllRequests(
    params: ReadRequestParams
  ): Observable<PaginatedResult<RequestReadModel>> {
    return this.api.get<PaginatedResult<RequestReadModel>>(
      'Request/all',
      params
    );
  }

  updateRequestStatus(request: RequestUpdateModel) {
    return this.api.put(`Request/update-status`, request);
  }
}
