import { Component, OnInit, ViewChild } from '@angular/core';
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

import { BehaviorSubject, combineLatest, forkJoin, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { ViewRequestDialogComponent } from '../../../_dialogs/view-request-dialog/view-request-dialog.component';
import { RequestUpdateModel } from '../../../../_models/request-update-model';
import { ConfirmationDialogComponent } from '../../../_dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../../../../_services/confirmation-dialog-service';
import { EmailService } from '../../../../_services/emailjs-service';

@Component({
  selector: 'app-secretary-initial-request',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    PaginatorModule,
    ButtonModule,
    Toolbar,
    InputIcon,
    IconField,
    InputTextModule,
    ViewRequestDialogComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './secretary-initial-request.component.html',
  styleUrl: './secretary-initial-request.component.css',
})
export class SecretaryInitialRequestComponent implements OnInit {
  @ViewChild('confirmationDialog')
  confirmationDialog!: ConfirmationDialogComponent;

  isViewDialogVisible = false;
  selectedRequestReadData: RequestReadModel[] = [];
  selectedRequestToView: RequestReadModel | null = null;

  private filterSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(8);
  private refreshSubject = new BehaviorSubject<void>(undefined);

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  statusId = 1;
  totalRecords = 0;
  isLoading = false;

  constructor(
    private studentRequestService: StudentRequestService,
    private confirmationDialogService: ConfirmationDialogService,
    private emailService: EmailService
  ) {}

  filteredRequests$ = combineLatest([
    this.filterSubject.pipe(debounceTime(500), distinctUntilChanged()),
    this.pageSubject,
    this.pageSizeSubject,
    this.refreshSubject,
  ]).pipe(
    tap(() => (this.isLoading = true)),
    switchMap(([filter, page, pageSize]) =>
      this.studentRequestService
        .readRequest({
          statusId: this.statusId,
          pageNumber: page + 1,
          pageSize: pageSize,
          filter: filter.trim(),
        })
        .pipe(
          catchError((err) => {
            console.error('Failed to load requests', err);
            return of({ items: [], totalCount: 0 });
          })
        )
    ),
    tap(() => (this.isLoading = false))
  );

  ngOnInit(): void {
    this.filterSubject.next('');

    this.filteredRequests$.subscribe((response) => {
      this.totalRecords = response.totalCount;
    });
  }

  onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value ?? '';
    this.filterSubject.next(value);
    this.pageSubject.next(0);
  }

  onPageChange(event: { first: number; rows: number }): void {
    this.pageSubject.next(event.first / event.rows);
    this.pageSizeSubject.next(event.rows);
  }

  //Button Enabling
  get selectionCount(): number {
    return this.selectedRequestReadData?.length || 0;
  }

  get isViewDisabled(): boolean {
    return this.selectionCount !== 1;
  }

  get isActionDisabled(): boolean {
    return this.selectionCount < 1;
  }

  //View Request Data
  onViewRequest(): void {
    if (this.selectionCount === 1) {
      this.selectedRequestToView = this.selectedRequestReadData[0];
      this.isViewDialogVisible = true;
    }
  }

  // Request Status Updation
  executeStatusChange(newStatusId: number, actionLabel: string): void {
    if (this.selectedRequestReadData.length === 0) return;

    const updates: RequestUpdateModel[] = this.selectedRequestReadData.map(
      (req) => ({
        requestId: req.requestId,
        statusId: newStatusId,
      })
    );

    this.isLoading = true;

    const updateCalls = this.selectedRequestReadData.map((request) =>
      this.studentRequestService
        .updateRequestStatus({
          requestId: request.requestId,
          statusId: newStatusId,
        })
        .pipe(
          switchMap(() =>
            this.emailService.generateUrlToken(request).pipe(
              tap((response) => {
                const token = response.token;

                if (actionLabel === 'Approve') {
                  this.emailService.sendApprovalEmail(request, token);
                } else {
                  this.emailService.sendDeclineEmail(request, token);
                }
              })
            )
          )
        )
    );

    forkJoin(updateCalls).subscribe({
      next: () => {
        this.isLoading = false;
        this.selectedRequestReadData = [];
        this.refreshSubject.next();
      },
      error: () => {
        this.isLoading = false;
        console.error('Some requests failed to update.');
      },
    });
  }

  // Confirmation Dialog Logic
  confirmStatusChange(statusId: number, label: 'Approve' | 'Decline'): void {
    if (this.selectedRequestReadData.length === 0) return;

    const response$ = new Subject<boolean>();

    this.confirmationDialogService.requestConfirmation({
      header: `Confirm ${label}`,
      message: `Are you sure you want to ${label.toLowerCase()} the selected request(s)?`,
      actionLabel: label,
      response$: response$,
    });

    response$.pipe(take(1)).subscribe((confirmed) => {
      if (confirmed) {
        this.executeStatusChange(statusId, label);
      }
    });
  }
}
