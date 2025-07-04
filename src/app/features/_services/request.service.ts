import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { RequestCreateModel } from '../_models/request-create.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/_models';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  getAllTeachers() {
    throw new Error('Method not implemented.');
  }
  constructor(private api: ApiService) {}

  addNewRequest(data: RequestCreateModel): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('Request', data);
  }

  addImageProofInRequest(formData: FormData) {
    return this.api.put('Request/AddImageProof', formData);
  }
}
