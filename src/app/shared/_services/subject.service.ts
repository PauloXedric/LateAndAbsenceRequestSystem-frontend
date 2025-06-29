import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import {
  ApiResponse,
  SubjectCreateModel,
  SubjectReadModel,
  SubjectUpdateModel,
} from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  constructor(private api: ApiService) {}

  addNewSubject(data: SubjectCreateModel): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('Subject', data);
  }

  getAllSubject(): Observable<SubjectReadModel[]> {
    return this.api.get('Subject');
  }

  updateSubject(data: SubjectUpdateModel): Observable<ApiResponse> {
    return this.api.put<ApiResponse>('Subject', data);
  }

  deleteSubject(id: number): Observable<ApiResponse> {
    return this.api.delete<ApiResponse>(`Subject/${id}`);
  }
}
