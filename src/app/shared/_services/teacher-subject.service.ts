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

  assignedSubjectToTeacher(
    data: TeacherSubjectsCodeModel
  ): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('TeacherSubject/AssignSubject', data);
  }

  teacherAssignedSubjectsList(): Observable<TeacherAssignedSubjectsModel[]> {
    return this.api.get('TeacherSubject/TeacherAssignedSubjects');
  }

  deleteTeacherWithSubjects(id: number): Observable<ApiResponse> {
    const params = new HttpParams().set('teacherId', id.toString());
    return this.api.delete<ApiResponse>(
      'TeacherSubject/DeleteTeacherWithSubjects',
      { params }
    );
  }
}
