import { Injectable } from '@angular/core';
import { RequestCreateModel } from '../_models/request-create.model';
import { ApiService } from './api.service';
import { RequestReadModel } from '../_models/request-read.model';
import { PaginatedResult } from '../_models/paginated-result.model';

@Injectable({
    providedIn: 'root'
})



export class StudentRequestService {

    constructor(private api: ApiService) {}

    addNewRequest(data: RequestCreateModel) {
        return this.api.post('Request/AddRequest', data);
    }

    readRequest(params: { statusId: number; pageNumber: number; pageSize: number }) {
    return this.api.get<PaginatedResult<RequestReadModel>>('Request/DisplayRequest', params);
  }
}



