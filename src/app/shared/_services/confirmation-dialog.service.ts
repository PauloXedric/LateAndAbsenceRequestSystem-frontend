import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  private confirmationSubject = new Subject<ConfirmationData>();

  confirmationRequests$: Observable<ConfirmationData> =
    this.confirmationSubject.asObservable();

  confirmation(data: ConfirmationData): void {
    this.confirmationSubject.next(data);
  }

  confirm$(data: Omit<ConfirmationData, 'response$'>): Observable<boolean> {
    const response$ = new Subject<boolean>();
    this.confirmation({ ...data, response$ });
    return response$.asObservable();
  }
}

export interface ConfirmationData {
  header: string;
  message: string;
  actionLabel: string;
  response$: Subject<boolean>;
}
