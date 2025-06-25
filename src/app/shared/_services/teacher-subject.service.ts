import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { TeacherAssignedSubjectsModel } from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherSubjectService {
  constructor(private api: ApiService) {}

  teacherAssignedSubjectsList(): Observable<TeacherAssignedSubjectsModel[]> {
    return this.api.get('TeacherSubject/TeacherAssignedSubjects');
  }
}
