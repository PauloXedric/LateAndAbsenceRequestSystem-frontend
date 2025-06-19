import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedResult, RequestReadModel } from '@shared/_models';
import { DateFormatPipe } from '@shared/_pipes/date-format.pipe';
import { Image } from 'primeng/image';

import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-request-table',
  standalone: true,
  imports: [TableModule, CommonModule, DateFormatPipe, Image],
  templateUrl: './request-table.component.html',
  styles: [
    `
      ::ng-deep .p-image-original {
        margin-left: 15rem !important;
        transition: transform 0.15s;
        max-width: 90vh !important;
        max-height: 90vh !important;
      }
    `,
  ],
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
  @Input() preview?: boolean = false;

  @Output() pageChange = new EventEmitter<{ first: number; rows: number }>();

  onSelectionChange(selected: RequestReadModel[]): void {
    this.selection = selected;
    this.selectionChange.emit(this.selection);
  }
}
