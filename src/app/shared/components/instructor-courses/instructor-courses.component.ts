import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import {
  SubjectCreateModel,
  SubjectReadModel,
  TeacherCreateModel,
  TeacherReadModel,
  TeacherSubjectsCodeModel,
} from '@shared/_models';
import {
  SubjectService,
  TeacherService,
  TeacherSubjectService,
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
import { MultiSelectModule } from 'primeng/multiselect';
import { FluidModule } from 'primeng/fluid';
import { InstructorsTableComponent } from '../_tables/instructors-table/instructors-table.component';
import { SubjectsTableComponent } from '../_tables/subjects-table/subjects-table.component';
import { InstructorSubjectTableComponent } from '../_tables/instructor-subject-table/instructor-subject-table.component';
import { DropdownModule } from 'primeng/dropdown';

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
    InstructorSubjectTableComponent,
    FluidModule,
    MultiSelectModule,
    DropdownModule,
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
  @ViewChild(InstructorSubjectTableComponent)
  instructorSubjectTableComponent!: InstructorSubjectTableComponent;

  teacherList: TeacherReadModel[] = [];
  subjectList: SubjectReadModel[] = [];
  selectedSubjects: SubjectReadModel[] = [];

  assignForm!: FormGroup;
  addTeacherForm!: FormGroup;
  addSubjectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private toastService: ToastService,
    private teacherSubjectService: TeacherSubjectService
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

    this.assignForm = this.fb.group({
      teacher: ['', Validators.required],
      subjects: [[], Validators.required],
    });

    this.loadTeachers();
    this.loadSubjects();
  }

  public loadTeachers(): void {
    this.teacherService.teacherList().subscribe({
      next: (data) => (this.teacherList = data),
      error: () => console.error('Failed to load teacher list'),
    });
  }

  public loadSubjects(): void {
    this.subjectService.subjectList().subscribe({
      next: (data) => {
        this.subjectList = data;
      },
      error: () => {
        console.error('Failed to load subject list');
      },
    });
  }

  onAssignSubjects(): void {
    if (this.assignForm.invalid) {
      this.assignForm.markAllAsTouched();
      return;
    }

    const selectedTeacher = this.assignForm.value.teacher;
    const selectedSubjects = this.assignForm.value.subjects;

    const assignFormValue: TeacherSubjectsCodeModel = {
      teacherCode: selectedTeacher.teacherCode,
      subjectCode: selectedSubjects.map((s: any) => s.subjectCode),
    };
    console.log(assignFormValue);
    this.teacherSubjectService
      .assignedSubjectToTeacher(assignFormValue)
      .subscribe({
        next: (res) => {
          this.toastService.showSuccess(res.message);
          this.instructorSubjectTableComponent.refresh();
          this.assignForm.reset();
        },
        error: (err) => {
          if (err.status === 404) {
            this.toastService.showWarn(err.error.message);
          } else if (err.status === 409) {
            this.toastService.showWarn(err.error.message);
          } else {
            this.toastService.showError(
              err.error?.message ||
                'An unknown error occurred during assigning of subjects.'
            );
          }
        },
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
        this.loadTeachers();
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occured while adding teacher.'
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
        this.loadSubjects();
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occureed while adding subject.'
          );
        }
      },
    });
  }
}
