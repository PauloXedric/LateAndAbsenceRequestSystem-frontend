import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubjectCreateModel, TeacherCreateModel } from '@shared/_models';
import {
  SubjectService,
  TeacherService,
  ToastService,
} from '@shared/_services';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { FluidModule } from 'primeng/fluid';
import { InstructorsTableComponent } from '../_tables/instructors-table/instructors-table.component';
import { SubjectsTableComponent } from '../_tables/subjects-table/subjects-table.component';

@Component({
  selector: 'app-instructor-courses',
  imports: [
    AccordionModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    InstructorsTableComponent,
    SubjectsTableComponent,
    FluidModule,
  ],
  standalone: true,
  providers: [TeacherService, SubjectService, MessageService],
  templateUrl: './instructor-courses.component.html',
  styleUrl: './instructor-courses.component.css',
})
export class InstructorCoursesComponent implements OnInit {
  @ViewChild(InstructorsTableComponent)
  instructorsTableComponent!: InstructorsTableComponent;
  @ViewChild(SubjectsTableComponent)
  subjectsTableComponent!: SubjectsTableComponent;

  addTeacherForm!: FormGroup;
  addSubjectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.addTeacherForm = this.fb.group({
      teacherName: ['', Validators.required],
      teacherCode: ['', Validators.required],
    });

    this.addSubjectForm = this.fb.group({
      subjectName: ['', Validators.required],
      subjectCode: ['', Validators.required],
    });
  }

  addTeacher(): void {
    if (this.addTeacherForm.invalid) {
      this.addTeacherForm.markAllAsTouched();
      return;
    }

    const formTeacherValue: TeacherCreateModel = this.addTeacherForm.value;

    this.teacherService.addNewTeacher(formTeacherValue).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.instructorsTableComponent.refresh();
        this.addTeacherForm.reset();
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occureed while adding teacher'
          );
        }
      },
    });
  }

  addSubject(): void {
    if (this.addSubjectForm.invalid) {
      this.addSubjectForm.markAllAsTouched();
      return;
    }

    const formSubjectValue: SubjectCreateModel = this.addSubjectForm.value;

    this.subjectService.addNewSubject(formSubjectValue).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.subjectsTableComponent.refresh();
        this.addSubjectForm.reset();
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occureed while adding subject'
          );
        }
      },
    });
  }
}
