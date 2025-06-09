import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RequestReadModel } from '../../../_models/request-read.model';

@Component({
  selector: 'app-view-request-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './view-request-dialog.component.html',
  styleUrls: ['./view-request-dialog.component.css']
})
export class ViewRequestDialogComponent {
  @Input() visible = false;
  @Input() request!: RequestReadModel | null; 
  @Output() visibleChange = new EventEmitter<boolean>();

  closeDialog(): void {
    this.visibleChange.emit(false);
  }
}
