import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';

import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import {
  PaginatedResult,
  RequestReadModel,
  RequestUpdateModel,
} from '@shared/_models';
import {
  ConfirmationDialogService,
  EmailService,
  FilterService,
  StudentRequestService,
} from '@shared/_services';
import {
  ConfirmationDialogComponent,
  StudentNumberSearchInputComponent,
  ViewRequestDialogComponent,
  RequestTableComponent,
  RequestTableButtonsComponent,
} from '@shared/components';
import { RequestActionEnum } from '@shared/_enums/request-action.enum';
import { RequestStatusEnum } from '@shared/_enums/request-status.enum';
import { RolesEnum } from '@shared/_enums/roles.enums';

@Component({
  selector: 'app-secretary-initial-request',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    PaginatorModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    ViewRequestDialogComponent,
    ConfirmationDialogComponent,
    StudentNumberSearchInputComponent,
    RequestTableComponent,
    RequestTableButtonsComponent,
  ],
  templateUrl: './secretary-initial-request.component.html',
  styles: [
    `
      h1 {
        padding-bottom: 1rem;
      }
    `,
  ],
})
export class SecretaryInitialRequestComponent implements OnInit {
  readonly RequestActionEnum = RequestActionEnum;
  readonly RequestStatusEnum = RequestStatusEnum;

  isViewDialogVisible = false;
  selectedRequestReadData: RequestReadModel[] = [];
  selectedRequestToView: RequestReadModel | null = null;

  private pageSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(7);
  private refreshSubject = new BehaviorSubject<void>(undefined);

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  statusId = RequestStatusEnum.WaitingForFirstSecretaryApproval;
  totalRecords = 0;
  isLoading = false;
  filteredRequests$!: Observable<PaginatedResult<RequestReadModel>>;
  constructor(
    private studentRequestService: StudentRequestService,
    private confirmationDialogService: ConfirmationDialogService,
    private emailService: EmailService,
    private filterService: FilterService
  ) {}

  columns = [
    { field: 'studentNumber', header: 'Student Number' },
    { field: 'studentName', header: 'Student Name' },
    { field: 'courseYearSection', header: 'Course/Year/Section' },
    { field: 'dateOfAbsence', header: 'Date of Absence' },
    { field: 'dateOfAttendance', header: 'Date of Attendance' },
    { field: 'reason', header: 'Reason' },
  ];

  ngOnInit(): void {
    this.filteredRequests$ = combineLatest([
      this.filterService.filter$.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ),
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
            filter: filter,
          })
          .pipe(
            catchError((err) => {
              console.error('Failed to load requests', err);
              return of({
                items: [],
                totalCount: 0,
                pageNumber: page + 1,
                pageSize: pageSize,
              });
            })
          )
      ),
      tap((response) => {
        this.totalRecords = response.totalCount;
        this.isLoading = false;
      })
    );
  }

  onFilterChange(value: string): void {
    this.filterService.setFilter(value);
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

    this.isLoading = true;

    const updateCalls = this.selectedRequestReadData.map((request) => {
      const updateModel: RequestUpdateModel = {
        requestId: request.requestId,
        statusId: newStatusId,
      };

      return this.studentRequestService.updateRequestStatus(updateModel).pipe(
        switchMap(() =>
          this.emailService.generateUrlToken(request).pipe(
            tap((response) => {
              const token = response.token;

              if (actionLabel === RequestActionEnum.Approve) {
                this.emailService.sendApprovalEmail(
                  request,
                  token,
                  RolesEnum.Secretary
                );
              } else {
                this.emailService.sendDeclineEmail(
                  request,
                  RolesEnum.Secretary
                );
              }
            })
          )
        )
      );
    });

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
  confirmStatusChange(
    statusId: RequestStatusEnum,
    label: RequestActionEnum
  ): void {
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
