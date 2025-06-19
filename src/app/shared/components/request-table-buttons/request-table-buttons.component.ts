import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-request-table-buttons',
  imports: [ButtonModule],
  template: `
    <p-button
      label="View"
      severity="info"
      [disabled]="isViewDisabled"
      (click)="view.emit()"
    ></p-button>
    <p-button
      label="Approve"
      severity="success"
      [disabled]="isActionDisabled"
      (click)="approve.emit()"
    ></p-button>
    <p-button
      label="Decline"
      severity="danger"
      [disabled]="isActionDisabled"
      (click)="decline.emit()"
    ></p-button>
  `,
  styles: [
    `
      :host ::ng-deep .p-button {
        width: 100px;
      }
    `,
  ],
})
export class RequestTableButtonsComponent {
  @Input() isActionDisabled = true;
  @Input() isViewDisabled = true;

  @Output() view = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  @Output() decline = new EventEmitter<void>();
}
