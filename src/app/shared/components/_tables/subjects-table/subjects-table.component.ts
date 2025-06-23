import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubjectReadModel } from '@shared/_models';
import { SubjectService } from '@shared/_services';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-subjects-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    Dialog,
    InputTextModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './subjects-table.component.html',
})
export class SubjectsTableComponent implements OnInit {
  visible: boolean = false;
  editSubjectForm!: FormGroup;

  subjectsTable: SubjectReadModel[] = [];

  constructor(
    private subjectService: SubjectService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.loadData();

    this.editSubjectForm = this.fb.group({
      subjectId: [0],
      subjectName: [''],
      subjectCode: [''],
    });
  }

  loadData(): void {
    this.subjectService.subjectList().subscribe({
      next: (data) => {
        this.subjectsTable = data;
      },
      error: () => {
        console.error("Failed to load teacher's data");
      },
    });
  }

  refresh(): void {
    this.loadData();
  }

  showDialog(subject: SubjectReadModel) {
    this.editSubjectForm.setValue({
      subjectId: subject.subjectId,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
    });
    this.visible = true;
  }
}
