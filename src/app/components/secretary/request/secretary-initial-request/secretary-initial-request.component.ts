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


import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ViewRequestDialogComponent } from '../../../_dialogs/view-request-dialog/view-request-dialog.component';
import { RequestUpdateModel } from '../../../../_models/request-update-model';

@Component({
  selector: 'app-secretary-initial-request',
  imports: [TableModule, CommonModule, PaginatorModule, ButtonModule, Toolbar, InputIcon, IconField, InputTextModule, ViewRequestDialogComponent],
  standalone: true,
  templateUrl: './secretary-initial-request.component.html',
  styleUrl: './secretary-initial-request.component.css'
})



export class SecretaryInitialRequestComponent implements OnInit, OnDestroy {

  isViewDialogVisible = false;

  requestReadData: RequestReadModel[] = [];
  selectedRequestReadData: RequestReadModel[] = [];
  selectedRequestToView: RequestReadModel | null = null;
  
  statusId = 1;
  page = 0;
  pageSize = 3;
  totalRecords = 0;
  filterStudentNumber: string = '';

  private filterSubject = new Subject<string>();
  private filterSubscription!: Subscription;
  isLoading = false;


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

 //Button enabling
 get selectionCount(): number {
    return this.selectedRequestReadData?.length || 0;
  }

  get isViewDisabled(): boolean {
    return this.selectionCount !== 1;
  }

  get isActionDisabled(): boolean {
    return this.selectionCount < 1;
  }

//Data Viewing for each rows
 onViewRequest(): void {
  if (this.selectedRequestReadData.length === 1) {
    this.selectedRequestToView = this.selectedRequestReadData[0];
    this.isViewDialogVisible = true;
  }
 }

 //Request Status Updation
 onUpdateStatus(newStatusId: number): void {
    if (this.selectedRequestReadData.length === 0) return;

    const updates: RequestUpdateModel[] = this.selectedRequestReadData.map(req => ({
      requestId: req.requestId,  
      statusId: newStatusId
    }));

    this.isLoading = true;

    const updateCalls = updates.map(update =>
      this.studentRequestService.updateRequestStatus(update).pipe(
        catchError(error => {
          console.error(`Failed to update request ${update.requestId}`, error);
          return of(null); 
        })
      )
    );

    forkJoin(updateCalls).subscribe({
      next: () => {
        this.isLoading = false;
        this.selectedRequestReadData = [];
        this.loadRequest(); 
      },
      error: () => {
        this.isLoading = false;
        console.error('Some requests failed to update.');
      }
    });
  }

}
