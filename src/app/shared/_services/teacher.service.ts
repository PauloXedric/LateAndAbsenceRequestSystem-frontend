import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { TeacherModel } from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private api: ApiService) {}

  addNewTeacher(data: TeacherModel): Observable<{ message: string }> {
    return this.api.post('Teacher/AddTeacher', data);
  }
}
