import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

export interface FormFieldConfig {
  label: string;
  controlName: string;
  type?: 'text' | 'email' | 'number';
}

@Component({
  selector: 'app-update-teacher-subject-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
  templateUrl: './update-teacher-subject-dialog.component.html',
  styleUrl: './update-teacher-subject-dialog.component.css',
})
export class UpdateTeacherSubjectDialogComponent {
  @Input() visible = false;
  @Input() form!: FormGroup;
  @Input() fields: FormFieldConfig[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  closeDialog() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    this.submit.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }
}
