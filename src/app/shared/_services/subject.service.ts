import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { ApiResponse, SubjectModel } from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  constructor(private api: ApiService) {}

  addNewSubject(data: SubjectModel): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('Subject/AddSubject', data);
  }
}
