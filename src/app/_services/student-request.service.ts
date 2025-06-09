import { Injectable } from '@angular/core';
import { RequestCreateModel } from '../_models/request-create.model';
import { ApiService } from './api.service';
import { RequestReadModel } from '../_models/request-read.model';
import { PaginatedResult } from '../_models/paginated-result.model';
import { ReadRequestParams } from '../_params/read-request-params';
import { RequestUpdateModel } from '../_models/request-update-model';



@Injectable({
    providedIn: 'root'
})



export class StudentRequestService {

    constructor(private api: ApiService) {}

    addNewRequest(data: RequestCreateModel) {
        return this.api.post('Request/AddRequest', data);
    }

    readRequest(params: ReadRequestParams) {
    return this.api.get<PaginatedResult<RequestReadModel>>('Request/DisplayRequest', params);
  }

   updateRequestStatus(request: RequestUpdateModel) {
    return this.api.put(`Request/UpdateStatus`, request);
  }
}



