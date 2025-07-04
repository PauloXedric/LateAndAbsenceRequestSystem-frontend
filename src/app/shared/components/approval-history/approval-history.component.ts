import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DateFormatPipe } from '@shared/_pipes/date-format.pipe';
import { RequestHistoryReadModel, PaginatedResult } from '@shared/_models';
import { RequestHistoryService, FilterService } from '@shared/_services';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  tap,
  of,
  Observable,
} from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { StudentNumberSearchInputComponent } from '../student-number-search-input/student-number-search-input.component';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-approval-history',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    InputTextModule,
    DateFormatPipe,
    PaginatorModule,
    DatePickerModule,
    StudentNumberSearchInputComponent,
  ],
  templateUrl: './approval-history.component.html',
  styleUrl: './approval-history.component.css',
})
export class ApprovalHistoryComponent implements OnInit {
  readonly columns = [
    { field: 'historyId', header: 'History ID' },
    { field: 'actionDate', header: 'Action Date' },
    { field: 'studentNumber', header: 'Student Number' },
    { field: 'studentName', header: 'Student Name' },
    { field: 'courseYearSection', header: 'Course/Year/Section' },
    { field: 'description', header: 'Description' },
    { field: 'performedByUser', header: 'Performed By' },
  ];

  private pageSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(5);
  private refreshSubject = new BehaviorSubject<void>(undefined);
  private dateFilterSubject = new BehaviorSubject<string | undefined>(
    undefined
  );

  history$!: Observable<PaginatedResult<RequestHistoryReadModel>>;

  first = 0;
  totalRecords = 0;
  isLoading = false;

  get pageSize(): number {
    return this.pageSizeSubject.value;
  }

  constructor(
    private requestHistoryService: RequestHistoryService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.history$ = combineLatest([
      this.filterService.filter$.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ),
      this.dateFilterSubject,
      this.pageSubject,
      this.pageSizeSubject,
      this.refreshSubject,
    ]).pipe(
      tap(() => (this.isLoading = true)),
      switchMap(([studentNumberFilter, dateFilter, page, pageSize]) => {
        const params = {
          pageNumber: page + 1,
          pageSize,
          dateFilter,
          studentNumberFilter,
        };

        console.log('📤 Sending API request with params:', params);

        return this.requestHistoryService.getAllRequestHistory(params).pipe(
          tap((res) => console.log('✅ Result from API:', res)),
          catchError(() =>
            of({
              items: [],
              totalCount: 0,
              pageNumber: page + 1,
              pageSize,
            })
          )
        );
      }),
      tap((result) => {
        this.totalRecords = result.totalCount;
        this.isLoading = false;
      })
    );
  }

  onPageChange(event: { first: number; rows: number }) {
    this.pageSubject.next(Math.floor(event.first / event.rows));
    this.pageSizeSubject.next(event.rows);
  }

  onFilterChange(value: string): void {
    this.first = 0;
    this.filterService.setFilter(value);
    this.pageSubject.next(0);
  }
  onDateFilterChange(value: Date): void {
    this.first = 0;
    const formattedDate = value ? value.toISOString().split('T')[0] : '';
    this.dateFilterSubject.next(formattedDate);
    this.pageSubject.next(0);
  }
}
