import { Component, OnInit, OnDestroy } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RequestReadModel } from '../../../../_models/request-read.model';
import { StudentRequestService } from '../../../../_services/student-request.service';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-secretary-initial-request',
  imports: [TableModule, CommonModule, PaginatorModule, ButtonModule, Toolbar, InputIcon, IconField, InputTextModule],
  standalone: true,
  templateUrl: './secretary-initial-request.component.html',
  styleUrl: './secretary-initial-request.component.css'
})



export class SecretaryInitialRequestComponent implements OnInit, OnDestroy {

  requestReadData: RequestReadModel[] = [];
  selectedRequestReadData!: RequestReadModel;
  statusId = 1;
  page = 0;
  pageSize = 3;
  totalRecords = 0;
  filterStudentNumber: string = '';



  private filterSubject = new Subject<string>();
  private filterSubscription!: Subscription;

  constructor(private studentRequestService: StudentRequestService) {}

  ngOnInit(): void {
    this.filterSubscription = this.filterSubject.pipe(
      debounceTime(500),         
      distinctUntilChanged()    
    ).subscribe(value => {
      this.filterStudentNumber = value.trim();
      this.page = 0;           
      this.loadRequest();
    });

    this.loadRequest();
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  loadRequest(): void {
    this.studentRequestService.readRequest({
      statusId: this.statusId,
      pageNumber: this.page + 1,
      pageSize: this.pageSize,
      filter: this.filterStudentNumber
    }).subscribe({
      next: (res) => {
        this.requestReadData = res.items;
        this.totalRecords = res.totalCount;
      },
      error: (err) => console.error('Failed to load requests', err)
    });
  }

  onPageChange(event: any): void {
    this.page = event.first / event.rows;
    this.pageSize = event.rows;
    this.loadRequest();
  }

  onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const value = input?.value ?? '';
    this.filterSubject.next(value);
}


}
