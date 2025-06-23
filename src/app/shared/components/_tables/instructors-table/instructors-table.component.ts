import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TeacherReadModel } from '@shared/_models';
import { TeacherService } from '@shared/_services';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-instructors-table',
  imports: [TableModule, CommonModule],
  standalone: true,
  templateUrl: './instructors-table.component.html',
})
export class InstructorsTableComponent implements OnInit {
  constructor(private teacherService: TeacherService) {}

  teachersTable: TeacherReadModel[] = [];

  ngOnInit(): void {
    this.loadData();
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
}
