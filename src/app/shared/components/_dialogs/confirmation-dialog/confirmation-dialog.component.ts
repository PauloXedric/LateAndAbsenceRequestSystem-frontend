import { Component, OnInit } from '@angular/core';
import {
  ConfirmationDialogService,
  ConfirmationData,
} from '../../../_services/confirmation-dialog.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent implements OnInit {
  private responseSubject!: Subject<boolean>;

  constructor(
    private confirmationService: ConfirmationDialogService,
    private confirmationServicePrimeng: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.confirmationService.confirmationRequests$.subscribe(
      (data: ConfirmationData) => {
        this.responseSubject = data.response$;

        this.confirmationServicePrimeng.confirm({
          header: data.header,
          message: data.message,
          acceptLabel: data.actionLabel,
          rejectLabel: 'Cancel',
          icon: 'pi pi-exclamation-triangle',
          acceptButtonStyleClass:
            data.actionLabel === 'Approve'
              ? 'p-button-success'
              : 'p-button-danger',
          rejectButtonStyleClass: 'p-button-secondary',
          accept: () => {
            this.responseSubject.next(true);
            this.responseSubject.complete();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${data.actionLabel}d successfully`,
            });
          },
          reject: () => {
            this.responseSubject.next(false);
            this.responseSubject.complete();

            this.messageService.add({
              severity: 'info',
              summary: 'Cancelled',
              detail: `${data.actionLabel} was cancelled`,
            });
          },
        });
      }
    );
  }
}
