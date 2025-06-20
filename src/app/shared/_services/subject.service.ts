import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { SubjectModel } from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  constructor(private api: ApiService) {}

  addNewSubject(data: SubjectModel): Observable<{ message: string }> {
    return this.api.post('Subject/AddSubject', data);
  }
}
