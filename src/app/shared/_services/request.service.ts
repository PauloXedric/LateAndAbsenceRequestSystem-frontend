import { Injectable } from '@angular/core';
import { RequestReadModel } from '../_models/request-read.model';
import { PaginatedResult } from '../_models/paginated-result.model';
import { ReadRequestParams } from '../_params/read-request.param';
import { RequestUpdateModel } from '../_models/request-update.model';
import { ApiService } from '@core';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private api: ApiService) {}

  getAllRequests(params: ReadRequestParams) {
    return this.api.get<PaginatedResult<RequestReadModel>>('Request', params);
  }

  updateRequestStatus(request: RequestUpdateModel) {
    return this.api.put(`Request/UpdateStatus`, request);
  }
}
