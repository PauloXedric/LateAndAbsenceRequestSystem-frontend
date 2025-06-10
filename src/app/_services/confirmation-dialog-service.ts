import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })


export class ConfirmationDialogService {

  private confirmationSubject = new Subject<ConfirmationData>();

  confirmationRequests$: Observable<ConfirmationData> = this.confirmationSubject.asObservable();


   requestConfirmation(data: ConfirmationData): void {
    this.confirmationSubject.next(data);
  }
}


export interface ConfirmationData {
  header: string;
  message: string;
  actionLabel: string;
  response$: Subject<boolean>; 
}
