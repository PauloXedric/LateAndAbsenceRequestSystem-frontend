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
import { ToolbarModule } from 'primeng/toolbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { FluidModule } from 'primeng/fluid';
import { InstructorsTableComponent } from '../_tables/instructors-table/instructors-table.component';
import { SubjectsTableComponent } from '../_tables/subjects-table/subjects-table.component';
import { InstructorSubjectTableComponent } from '../_tables/instructor-subject-table/instructor-subject-table.component';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-instructor-courses',
  imports: [
    CommonModule,
    AccordionModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    InstructorsTableComponent,
    SubjectsTableComponent,
    InstructorSubjectTableComponent,
    FluidModule,
    MultiSelectModule,
    SelectModule,
    CardModule,
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
    this.teacherService.getAllTeachers().subscribe({
      next: (data) => (this.teacherList = data),
      error: () => console.error('Failed to load teacher list'),
    });
  }

  public loadSubjects(): void {
    this.subjectService.getAllSubject().subscribe({
      next: (data) => {
        this.subjectList = data;
      },
      error: () => {
        console.error('Failed to load subject list');
      },
    });
  }

  onAssignSubjects(): void {
    const selectedTeacher = this.assignForm.value.teacher;
    const selectedSubjects = this.assignForm.value.subjects;

    const assignFormValue: TeacherSubjectsCodeModel = {
      teacherCode: selectedTeacher.teacherCode,
      subjectCode: selectedSubjects.map((s: any) => s.subjectCode),
    };
    console.log(assignFormValue);
    this.teacherSubjectService
      .assignedSubjectsToTeacher(assignFormValue)
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

  patchExistingValue(data: { teacher: any; subjects: string[] }): void {
    const selectedTeacher = this.teacherList.find(
      (t) => t.teacherCode === data.teacher.teacherCode
    );

    const selectedSubjects = this.subjectList.filter((subject) => {
      return data.subjects.some((s) => {
        const [name, code] = s
          .split('(')
          .map((part) => part.replace(')', '').trim());
        return subject.subjectName === name && subject.subjectCode === code;
      });
    });

    this.assignForm.patchValue({
      teacher: selectedTeacher,
      subjects: selectedSubjects,
    });
  }

  onTeacherSelected(selectedTeacher: TeacherReadModel): void {
    const instructorData =
      this.instructorSubjectTableComponent.assignedSubjectsTable.find(
        (i) => i.teacherCode === selectedTeacher.teacherCode
      );

    if (!instructorData || !instructorData.assignedSubjects) {
      this.assignForm.patchValue({ subjects: [] });
      return;
    }

    const assignedArray = instructorData.assignedSubjects
      .split(',')
      .map((s) => s.trim());

    const selectedSubjects = this.subjectList.filter((subject) =>
      assignedArray.some((s: string) => {
        const [name, code] = s
          .split('(')
          .map((part) => part.replace(')', '').trim());
        return subject.subjectName === name && subject.subjectCode === code;
      })
    );

    this.assignForm.patchValue({
      subjects: selectedSubjects,
    });
  }
}
