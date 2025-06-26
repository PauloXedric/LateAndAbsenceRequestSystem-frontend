import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherReadModel } from '@shared/_models';
import {
  ConfirmationDialogService,
  TeacherService,
  ToastService,
} from '@shared/_services';
import {
  FormFieldConfig,
  UpdateTeacherSubjectDialogComponent,
} from '@shared/components/_dialogs/update-teacher-subject-dialog/update-teacher-subject-dialog.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-instructors-table',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    UpdateTeacherSubjectDialogComponent,
  ],
  standalone: true,
  templateUrl: './instructors-table.component.html',
})
export class InstructorsTableComponent implements OnInit {
  @Output() teacherUpdated = new EventEmitter<void>();
  @Output() refreshInstructorSubject = new EventEmitter<void>();

  visible = false;
  editTeacherForm!: FormGroup;

  teachersTable: TeacherReadModel[] = [];

  fields: FormFieldConfig[] = [
    { label: 'Name', controlName: 'teacherName' },
    { label: 'Code', controlName: 'teacherCode' },
  ];

  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.editTeacherForm = this.fb.group({
      teacherId: [0],
      teacherName: ['', Validators.required],
      teacherCode: ['', Validators.required],
    });
  }

  loadData(): void {
    this.teacherService.teacherList().subscribe({
      next: (data) => {
        this.teachersTable = data;
      },
      error: () => {
        console.error("Failed to load teacher's data");
      },
    });
  }

  refresh(): void {
    this.loadData();
  }

  showDialog(teacher: TeacherReadModel) {
    this.editTeacherForm.patchValue(teacher);
    this.visible = true;
  }

  updateTeacher() {
    const updatedata = this.editTeacherForm.value;

    this.teacherService.updateTeacher(updatedata).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.visible = false;
        this.loadData();
        this.teacherUpdated.emit();
        this.refreshInstructorSubject.emit();
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occureed while updating teacher'
          );
        }
      },
    });
  }

  deleteTeacher(teacherId: number) {
    this.confirmationDialogService
      .confirm$({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this teacher?',
        actionLabel: 'Delete',
      })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.teacherService.deleteTeacher(teacherId).subscribe({
            next: (res) => {
              this.toastService.showSuccess(res.message);
              this.visible = false;
              this.loadData();
              this.teacherUpdated.emit();
              this.refreshInstructorSubject.emit();
            },
            error: (err) => {
              this.toastService.showError(
                err.error?.message || 'Error occured while deleting teacher'
              );
            },
          });
        }
      });
  }
}
