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
    return this.api.post<ApiResponse>('Teacher/AddTeacher', data);
  }

  teacherList(): Observable<TeacherReadModel[]> {
    return this.api.get('Teacher/TeacherList');
  }

  updateTeacher(data: TeacherUpdateModel): Observable<ApiResponse> {
    return this.api.put<ApiResponse>('Teacher/UpdateTeacher', data);
  }
}
