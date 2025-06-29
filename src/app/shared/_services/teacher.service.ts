import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import {
  ApiResponse,
  TeacherCreateModel,
  TeacherReadModel,
  TeacherUpdateModel,
} from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private api: ApiService) {}

  addNewTeacher(data: TeacherCreateModel): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('Teacher', data);
  }

  getAllTeachers(): Observable<TeacherReadModel[]> {
    return this.api.get<TeacherReadModel[]>('Teacher');
  }

  updateTeacher(data: TeacherUpdateModel): Observable<ApiResponse> {
    return this.api.put<ApiResponse>('Teacher', data);
  }

  deleteTeacher(id: number): Observable<ApiResponse> {
    return this.api.delete<ApiResponse>(`Teacher/${id}`);
  }
}
