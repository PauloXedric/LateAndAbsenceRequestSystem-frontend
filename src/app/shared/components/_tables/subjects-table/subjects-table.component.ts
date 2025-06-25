import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectReadModel } from '@shared/_models';
import {
  ConfirmationDialogService,
  SubjectService,
  ToastService,
} from '@shared/_services';
import {
  FormFieldConfig,
  UpdateTeacherSubjectDialogComponent,
} from '@shared/components/_dialogs/update-teacher-subject-dialog/update-teacher-subject-dialog.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-subjects-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    UpdateTeacherSubjectDialogComponent,
  ],
  standalone: true,
  templateUrl: './subjects-table.component.html',
})
export class SubjectsTableComponent implements OnInit {
  @Output() subjectUpdated = new EventEmitter<void>();

  visible = false;
  editSubjectForm!: FormGroup;

  subjectsTable: SubjectReadModel[] = [];

  fields: FormFieldConfig[] = [
    { label: 'Name', controlName: 'subjectName' },
    { label: 'Code', controlName: 'subjectCode' },
  ];

  constructor(
    private subjectService: SubjectService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.editSubjectForm = this.fb.group({
      subjectId: [0],
      subjectName: ['', Validators.required],
      subjectCode: ['', Validators.required],
    });
  }

  loadData(): void {
    this.subjectService.subjectList().subscribe({
      next: (data) => {
        this.subjectsTable = data;
      },
      error: () => {
        console.error("Failed to load subject's data");
      },
    });
  }

  refresh(): void {
    this.loadData();
  }

  showDialog(subject: SubjectReadModel) {
    this.editSubjectForm.patchValue(subject);
    this.visible = true;
  }

  updateSubject() {
    const updatedData = this.editSubjectForm.value;

    this.subjectService.updateSubject(updatedData).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.visible = false;
        this.loadData();
        this.subjectUpdated.emit();
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occureed while updating subject'
          );
        }
      },
    });
  }

  deleteSubject(subjectId: number): void {
    this.confirmationDialogService
      .confirm$({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this subject?',
        actionLabel: 'Delete',
      })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.subjectService.deleteSubject(subjectId).subscribe({
            next: (res) => {
              this.toastService.showSuccess(res.message);
              this.visible = false;
              this.loadData();
              this.subjectUpdated.emit();
            },
            error: (err) => {
              this.toastService.showError(
                err.error?.message || 'Error occured while deleting subject'
              );
            },
          });
        }
      });
  }
}
