import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TeacherAssignedSubjectsModel } from '@shared/_models';
import { SplitAndTrimPipe } from '@shared/_pipes/split-and-trim.pipe';
import {
  ConfirmationDialogService,
  TeacherSubjectService,
  ToastService,
} from '@shared/_services';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-instructor-subject-table',
  imports: [TableModule, ButtonModule, SplitAndTrimPipe, CommonModule],
  standalone: true,
  templateUrl: './instructor-subject-table.component.html',
})
export class InstructorSubjectTableComponent implements OnInit {
  @Output()
  teacherSubjectSelected = new EventEmitter<{
    teacher: any;
    subjects: any[];
  }>();

  assignedSubjectsTable: TeacherAssignedSubjectsModel[] = [];

  constructor(
    private teacherSubjectService: TeacherSubjectService,
    private toastService: ToastService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.teacherSubjectService.teacherAssignedSubjectsList().subscribe({
      next: (data) => {
        this.assignedSubjectsTable = data;
      },
      error: () => {
        console.error("Failed to load assigned subject's data");
      },
    });
  }

  refresh(): void {
    this.loadData();
  }

  onDeleteTeacherWithSubjects(id: number): void {
    this.confirmationDialogService
      .confirm$({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this data?',
        actionLabel: 'Delete',
      })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.teacherSubjectService.deleteTeacherWithSubjects(id).subscribe({
            next: (res) => {
              this.toastService.showSuccess(
                res.message || 'Deleted successfully.'
              );
              this.loadData();
            },
            error: (err) => {
              this.toastService.showError(
                err.error?.message || 'Failed to delete teacher with subjects.'
              );
            },
          });
        }
      });
  }

  selectTeacherWithSubjects(
    subjectsAssigned: TeacherAssignedSubjectsModel
  ): void {
    const subjects = (subjectsAssigned.assignedSubjects || '')
      .split(',')
      .map((s) => s.trim());

    this.teacherSubjectSelected.emit({
      teacher: {
        teacherName: subjectsAssigned.teacherName,
        teacherCode: subjectsAssigned.teacherCode,
      },
      subjects: subjects,
    });
  }
}
