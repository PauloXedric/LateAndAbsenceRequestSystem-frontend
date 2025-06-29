import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { RequestCreateModel } from '../_models/request-create.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private api: ApiService) {}

  addNewRequest(data: RequestCreateModel) {
    return this.api.post('Request', data);
  }

  addImageProofInRequest(formData: FormData) {
    return this.api.put('Request/AddImageProof', formData);
  }
}
