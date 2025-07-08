import { Component, Input } from '@angular/core';
import { RequestActionEnum } from '@shared/_enums/request-action.enum';
import { RequestStatusEnum } from '@shared/_enums/request-status.enum';
import {
  RequestReadModel,
  PaginatedResult,
  RequestUpdateModel,
  RequestHistoryCreateModel,
} from '@shared/_models';
import {
  ConfirmationDialogService,
  EmailService,
  FilterService,
  RequestHistoryService,
  RequestService,
  ToastService,
} from '@shared/_services';
import { ConfirmationDialogComponent } from '@shared/components/_dialogs/confirmation-dialog/confirmation-dialog.component';
import { ViewRequestDialogComponent } from '@shared/components/_dialogs/view-request-dialog/view-request-dialog.component';
import { RequestTableButtonsComponent } from '@shared/components/request-table-buttons/request-table-buttons.component';
import { StudentNumberSearchInputComponent } from '@shared/components/student-number-search-input/student-number-search-input.component';
import { DateFormatPipe } from '@shared/_pipes/date-format.pipe';

import { CommonModule } from '@angular/common';
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
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { Image } from 'primeng/image';
import { ApproverRolesEnum } from '@shared/_enums/approver-roles.enum';
import { toRequestGenTokenModel } from '@shared/_mappers/request.mapper';
import { RequestResultEnum } from '@shared/_enums';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-requests-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    PaginatorModule,
    InputTextModule,
    DateFormatPipe,
    Image,
    RequestTableButtonsComponent,
    ViewRequestDialogComponent,
    StudentNumberSearchInputComponent,
  ],
  templateUrl: './requests-table.component.html',
  styles: [
    `
      ::ng-deep .p-image-original {
        margin-left: 15rem !important;
        transition: transform 0.15s;
        max-width: 90vh !important;
        max-height: 90vh !important;
      }

      ::ng-deep .p-image-toolbar {
        margin-top: 2rem;
      }
    `,
  ],
})
export class RequestsTableComponent {
  @Input() statusId!: RequestStatusEnum;
  @Input() nextApprovalStatus!: RequestStatusEnum;
  @Input() rejectedStatus!: RequestStatusEnum;
  @Input() roles!: ApproverRolesEnum;
  @Input() columns: { field: string; header: string }[] = [];
  @Input() addApproveHistory!: RequestResultEnum;
  @Input() addRejectHistory!: RequestResultEnum;

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
  preview = true;
  fileBaseUrl = environment.fileBaseUrl;

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  filteredRequests$!: Observable<PaginatedResult<RequestReadModel>>;

  constructor(
    private requestService: RequestService,
    private confirmationDialogService: ConfirmationDialogService,
    private toastService: ToastService,
    private emailService: EmailService,
    private filterService: FilterService,
    private requestHistoryService: RequestHistoryService
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
        this.requestService
          .getAllRequests({
            statusId: this.statusId,
            pageNumber: page + 1,
            pageSize,
            filter,
          })
          .pipe(
            catchError(() =>
              of({
                items: [],
                totalCount: 0,
                pageNumber: page + 1,
                pageSize,
              })
            )
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

  onSelectionChange(selected: RequestReadModel[]): void {
    this.selectedRequestReadData = selected;
  }

  onViewRequest(): void {
    if (this.selectedRequestReadData.length === 1) {
      this.selectedRequestToView = this.selectedRequestReadData[0];
      this.isViewDialogVisible = true;
    }
  }

  confirmStatusChange(status: RequestStatusEnum, label: RequestActionEnum) {
    this.confirmationDialogService
      .confirm$({
        header: `Confirm ${label}`,
        message: `Are you sure you want to ${label.toLowerCase()} the selected request(s)?`,
        actionLabel: label,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.executeStatusChange(status, label);
        }
      });
  }

  executeStatusChange(newStatusId: RequestStatusEnum, actionLabel: string) {
    if (this.selectedRequestReadData.length === 0) return;
    this.isLoading = true;

    const updateCalls = this.selectedRequestReadData.map((request) => {
      const updateModel: RequestUpdateModel = {
        requestId: request.requestId,
        statusId: newStatusId,
      };

      return this.requestService.updateRequestStatus(updateModel).pipe(
        switchMap(() => {
          const tokenModel = toRequestGenTokenModel(request);

          return this.emailService.generateNewToken(tokenModel).pipe(
            switchMap((response) => {
              const token = response.urlToken;

              const historyModel: RequestHistoryCreateModel = {
                requestId: request.requestId,
                resultId:
                  actionLabel === RequestActionEnum.Approve
                    ? this.addApproveHistory
                    : this.addRejectHistory,
              };

              return this.requestHistoryService
                .addRequestHistory(historyModel)
                .pipe(
                  tap(() => {
                    if (actionLabel === RequestActionEnum.Approve) {
                      // this.emailService.sendApprovalEmail(
                      //   tokenModel,
                      //   token,
                      //   this.roles
                      // );
                    } else {
                      // this.emailService.sendDeclineEmail(
                      //   tokenModel,
                      //   this.roles
                      // );
                    }
                  })
                );
            })
          );
        })
      );
    });

    forkJoin(updateCalls).subscribe({
      next: () => {
        this.isLoading = false;
        this.selectedRequestReadData = [];
        this.refreshSubject.next();
        this.toastService.showSuccess(
          `Requests ${actionLabel.toLowerCase()}d successfully.`
        );
      },
      error: () => {
        this.isLoading = false;
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
