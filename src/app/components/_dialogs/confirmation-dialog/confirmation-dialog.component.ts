import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService, ConfirmationData } from '../../../_services/confirmation-dialog-service';
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
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent implements OnInit {

header = '';
  message = '';
  actionLabel = '';
  isVisible = false;
  private responseSubject!: Subject<boolean>;

  constructor(private confirmationService: ConfirmationDialogService) {}

  ngOnInit() {
    this.confirmationService.confirmationRequests$.subscribe((data: ConfirmationData) => {
      this.header = data.header;
      this.message = data.message;
      this.actionLabel = data.actionLabel;
      this.isVisible = true;
      this.responseSubject = data.response$;
    });
  }

  onConfirm() {
    this.isVisible = false;
    this.responseSubject.next(true);
    this.responseSubject.complete();
    this.resetDialog();
  }

  onCancel() {
    this.isVisible = false;
    this.responseSubject.next(false);
    this.responseSubject.complete();
    this.resetDialog();
  }

  resetDialog(): void {
    this.header = '';
    this.message = '';
    this.actionLabel = '';
    this.isVisible = false;
  }

  onDialogHide() {
    this.isVisible = false;
    this.resetDialog();
  }
}
