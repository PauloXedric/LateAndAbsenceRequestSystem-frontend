import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TeacherAssignedSubjectsModel } from '@shared/_models';
import { SplitAndTrimPipe } from '@shared/_pipes/split-and-trim.pipe';
import { TeacherSubjectService } from '@shared/_services';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-instructor-subject-table',
  imports: [TableModule, ButtonModule, SplitAndTrimPipe, CommonModule],
  standalone: true,
  templateUrl: './instructor-subject-table.component.html',
})
export class InstructorSubjectTableComponent implements OnInit {
  assignedSubjectsTable: TeacherAssignedSubjectsModel[] = [];

  constructor(private teacherSubjectService: TeacherSubjectService) {}

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
}
