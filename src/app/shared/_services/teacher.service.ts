import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { TeacherCreateModel, TeacherReadModel } from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private api: ApiService) {}

  addNewTeacher(data: TeacherCreateModel): Observable<{ message: string }> {
    return this.api.post('Teacher/AddTeacher', data);
  }

  teacherList(): Observable<TeacherReadModel[]> {
    return this.api.get('Teacher/TeacherList');
  }
}
