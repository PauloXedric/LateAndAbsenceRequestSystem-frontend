import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import {
  ApiResponse,
  TeacherAssignedSubjectsModel,
  TeacherSubjectsCodeModel,
} from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherSubjectService {
  constructor(private api: ApiService) {}

  assignedSubjectsToTeacher(
    data: TeacherSubjectsCodeModel
  ): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('TeacherSubject', data);
  }

  getAllTeacherAssignedSubjects(): Observable<TeacherAssignedSubjectsModel[]> {
    return this.api.get('TeacherSubject');
  }

  deleteTeacherWithSubjects(id: number): Observable<ApiResponse> {
    return this.api.delete<ApiResponse>(`TeacherSubject/${id}`);
  }
}
