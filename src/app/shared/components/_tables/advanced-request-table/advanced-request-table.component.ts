import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RequestActionEnum } from '@shared/_enums/request-action.enum';
import { RequestStatusEnum } from '@shared/_enums/request-status.enum';
import {
  RequestReadModel,
  PaginatedResult,
  RequestUpdateModel,
} from '@shared/_models';
import {
  StudentRequestService,
  ConfirmationDialogService,
  EmailService,
  FilterService,
} from '@shared/_services';
import { ConfirmationDialogComponent } from '@shared/components/_dialogs/confirmation-dialog/confirmation-dialog.component';
import { ViewRequestDialogComponent } from '@shared/components/_dialogs/view-request-dialog/view-request-dialog.component';
import { RequestTableButtonsComponent } from '@shared/components/request-table-buttons/request-table-buttons.component';
import { StudentNumberSearchInputComponent } from '@shared/components/student-number-search-input/student-number-search-input.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  of,
  Subject,
  take,
  forkJoin,
} from 'rxjs';
import { RequestTableComponent } from '../request-table/request-table.component';

@Component({
  selector: 'app-advanced-request-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    PaginatorModule,
    InputTextModule,
    RequestTableComponent,
    RequestTableButtonsComponent,
    ViewRequestDialogComponent,
    ConfirmationDialogComponent,
    StudentNumberSearchInputComponent,
  ],
  templateUrl: './advanced-request-table.component.html',
})
export class AdvancedRequestTableComponent {
  @Input() statusId!: RequestStatusEnum;
  @Input() nextApprovalStatus!: RequestStatusEnum;
  @Input() rejectedStatus!: RequestStatusEnum;

  readonly RequestActionEnum = RequestActionEnum;
  readonly RequestStatusEnum = RequestStatusEnum;

  isViewDialogVisible = false;
  selectedRequestReadData: RequestReadModel[] = [];
  selectedRequestToView: RequestReadModel | null = null;

  private pageSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(7);
  private refreshSubject = new BehaviorSubject<void>(undefined);

  totalRecords = 0;
  isLoading = false;

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  filteredRequests$!: Observable<PaginatedResult<RequestReadModel>>;

  columns = [
    { field: 'studentNumber', header: 'Student Number' },
    { field: 'studentName', header: 'Student Name' },
    { field: 'courseYearSection', header: 'Course/Year/Section' },
    { field: 'proofImage', header: 'Image Proof' },
    { field: 'parentValidImage', header: "Parent's ID" },
    { field: 'medicalCertificate', header: 'Med. Cert.' },
  ];

  constructor(
    private studentRequestService: StudentRequestService,
    private confirmationDialogService: ConfirmationDialogService,
    private emailService: EmailService,
    private filterService: FilterService
  ) {}

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
            pageSize,
            filter,
          })
          .pipe(
            catchError((err) => {
              console.error('Failed to load requests', err);
              return of({
                items: [],
                totalCount: 0,
                pageNumber: page + 1,
                pageSize,
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

  onPageChange(event: { first: number; rows: number }) {
    this.pageSubject.next(event.first / event.rows);
    this.pageSizeSubject.next(event.rows);
  }

  onFilterChange(value: string): void {
    this.filterService.setFilter(value);
    this.pageSubject.next(0);
  }

  onViewRequest(): void {
    if (this.selectedRequestReadData.length === 1) {
      this.selectedRequestToView = this.selectedRequestReadData[0];
      this.isViewDialogVisible = true;
    }
  }

  confirmStatusChange(status: RequestStatusEnum, label: RequestActionEnum) {
    const response$ = new Subject<boolean>();

    this.confirmationDialogService.requestConfirmation({
      header: `Confirm ${label}`,
      message: `Are you sure you want to ${label.toLowerCase()} the selected request(s)?`,
      actionLabel: label,
      response$: response$,
    });

    response$.pipe(take(1)).subscribe((confirmed) => {
      if (confirmed) this.executeStatusChange(status, label);
    });
  }

  executeStatusChange(newStatusId: number, actionLabel: string) {
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
                this.emailService.sendApprovalEmail(request, token);
              } else {
                this.emailService.sendDeclineEmail(request, token);
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

  get isViewDisabled(): boolean {
    return this.selectedRequestReadData.length !== 1;
  }

  get isActionDisabled(): boolean {
    return this.selectedRequestReadData.length === 0;
  }
}
