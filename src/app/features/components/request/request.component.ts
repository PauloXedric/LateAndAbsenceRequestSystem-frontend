import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RequestService } from '@features/_services/request.service';
import { RequestCreateModel } from '@features/_models/request-create.model';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TeacherSubjectService, ToastService } from '@shared/_services';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { TextareaModule } from 'primeng/textarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
  TeacherAssignedSubjectsModel,
  TeacherReadModel,
} from '@shared/_models';

@Component({
  selector: 'request-form',
  standalone: true,
  templateUrl: './request.component.html',
  imports: [
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    DatePickerModule,
    InputGroupAddonModule,
    InputGroupModule,
    KeyFilterModule,
    CardModule,
    FluidModule,
    TextareaModule,
    AutoCompleteModule,
  ],
  styleUrls: ['./request.component.css'],
})
export class RequestComponent implements OnInit {
  @ViewChild('formSection') formSection!: ElementRef<HTMLElement>;

  dateOfAbsence: Date | undefined;
  dateOfAttendance: Date | undefined;

  requestForm!: FormGroup;

  teacherSubjectMap: TeacherAssignedSubjectsModel[] = [];
  filteredTeachers: string[] = [];
  filteredSubjects: string[] = [];

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private toastService: ToastService,
    private teacherSubjectService: TeacherSubjectService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.formSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 5000);

    this.requestForm = this.fb.group({
      studentNumber: ['', Validators.required],
      studentName: ['', Validators.required],
      courseYearSection: ['', Validators.required],
      teacher: ['', Validators.required],
      subjectCode: ['', Validators.required],
      dateOfAbsence: ['', Validators.required],
      dateOfAttendance: ['', Validators.required],
      parentsCpNumber: ['', Validators.required],
      reason: ['', Validators.required],
    });

    this.teacherSubjectService
      .getAllTeacherAssignedSubjects()
      .subscribe((data) => {
        this.teacherSubjectMap = data;
        console.log('✅ Loaded teacher-subject map:', data);
      });
  }

  submitRequestForm(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const newRequest: RequestCreateModel = this.requestForm.value;
    console.log('Data being sent to backend:', newRequest);

    this.requestService.addNewRequest(newRequest).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.requestForm.reset();
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

  searchTeachers(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredTeachers = this.teacherSubjectMap
      .map((t) => t.teacherName)
      .filter((name) => name.toLowerCase().includes(query));

    console.log('🔍 Filtered Teachers:', this.filteredTeachers);
  }

  searchSubjects(event: any): void {
    const teacherName = this.requestForm.get('teacher')?.value;
    const query = event.query.toLowerCase();

    const teacherEntry = this.teacherSubjectMap.find(
      (t) => t.teacherName.toLowerCase() === teacherName?.toLowerCase()
    );

    if (teacherEntry && teacherEntry.assignedSubjects) {
      this.filteredSubjects = teacherEntry.assignedSubjects
        .split(',') // split string into array
        .map((subjectCode: string) => subjectCode.trim())
        .filter((code: string) => code.toLowerCase().includes(query));
    } else {
      this.filteredSubjects = [];
    }

    console.log('📘 Filtered Subjects:', this.filteredSubjects);
  }
}
