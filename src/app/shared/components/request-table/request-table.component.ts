import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedResult, RequestReadModel } from '@shared/_models';
import { DateFormatPipe } from '@shared/_pipes/date-format.pipe';

import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-request-table',
  standalone: true,
  imports: [TableModule, CommonModule, DateFormatPipe],
  templateUrl: './request-table.component.html',
})
export class RequestTableComponent {
  @Input() value$!: Observable<PaginatedResult<RequestReadModel>>;
  @Input() selection: RequestReadModel[] = [];
  @Output() selectionChange = new EventEmitter<RequestReadModel[]>();

  @Input() pageSize!: number;
  @Input() totalRecords!: number;
  @Input() columns: {
    field: string;
    header: string;
  }[] = [];

  @Output() pageChange = new EventEmitter<{ first: number; rows: number }>();
}
