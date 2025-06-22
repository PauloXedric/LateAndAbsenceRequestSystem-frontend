import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubjectModel, TeacherCreateModel } from '@shared/_models';
import { SubjectService, TeacherService } from '@shared/_services';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InstructorsTableComponent } from '../_tables/instructors-table/instructors-table.component';
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
  ],
  standalone: true,
  providers: [TeacherService, SubjectService, MessageService],
  templateUrl: './instructor-courses.component.html',
  styleUrl: './instructor-courses.component.css',
})
export class InstructorCoursesComponent implements OnInit {
  @ViewChild(InstructorsTableComponent)
  instructorsTableComponent!: InstructorsTableComponent;

  addTeacherForm!: FormGroup;
  addSubjectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private messageService: MessageService
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
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });

        this.instructorsTableComponent.refresh();
        this.addTeacherForm.reset();
      },
      error: (err) => {
        this.messageService.add({
          severity: err.status === 409 ? 'warn' : 'error',
          summary: err.status === 409 ? 'Warning' : 'Error',
          detail: err.error?.message || 'Something went wrong.',
        });
      },
    });
  }

  addSubject(): void {
    if (this.addSubjectForm.invalid) {
      this.addSubjectForm.markAllAsTouched();
      return;
    }

    const formSubjectValue: SubjectModel = this.addSubjectForm.value;
    this.subjectService.addNewSubject(formSubjectValue).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: err.status === 409 ? 'warn' : 'error',
          summary: err.status === 409 ? 'Warning' : 'Error',
          detail: err.error?.message || 'Something went wrong.',
        });
      },
    });
  }
}
