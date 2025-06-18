import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  setFilter(value: string): void {
    this.filterSubject.next(value.trim());
  }

  resetFilter(): void {
    this.filterSubject.next('');
  }
}
