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
import { RequestCreateModel } from '@features/_models/request/request-create.model';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TeacherSubjectService, ToastService } from '@shared/_services';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { TextareaModule } from 'primeng/textarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TeacherAssignedSubjectsModel } from '@shared/_models';
import { CopyrightComponent } from '@shared/components';
import { SmsService } from '@features/_services/sms.service';
import { DateFormatPipe } from '@shared/_pipes/date-format.pipe';

@Component({
  selector: 'request-form',
  standalone: true,
  templateUrl: './request.component.html',
  providers: [DateFormatPipe],
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
    CopyrightComponent,
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
    private teacherSubjectService: TeacherSubjectService,
    private smsService: SmsService,
    private dateFormatPipe: DateFormatPipe
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

    this.requestForm
      .get('courseYearSection')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.requestForm
            .get('courseYearSection')
            ?.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });

    this.teacherSubjectService
      .getAllTeacherAssignedSubjects()
      .subscribe((data) => {
        this.teacherSubjectMap = data;
      });
  }

  submitRequestForm(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const newRequest: RequestCreateModel = this.requestForm.value;

    this.requestService.addNewRequest(newRequest).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);

        const formattedDate = this.dateFormatPipe.transform(new Date());

        const message = `[PSU - Porac Campus Notification]

Dear Parent/Guardian,

This is to formally notify you that your child, ${newRequest.studentName}, has submitted a Lateness/Absence Request for the subject "${newRequest.subjectCode}" on ${formattedDate}.

This message serves as the official record that you have been notified of this request, in compliance with school documentation requirements.`;

        this.smsService.sendSms(newRequest.parentsCpNumber, message).subscribe({
          next: (smsRes) => {
            console.log('SMS sent:', smsRes);
          },
          error: (smsErr) => {
            console.error('SMS sending failed:', smsErr);
          },
        });

        this.requestForm.reset();
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastService.showWarn(err.error.message);
        } else {
          this.toastService.showError(
            err.error?.message || 'Error occurred while adding request.'
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
  }

  searchSubjects(event: any): void {
    const teacherName = this.requestForm.get('teacher')?.value;
    const query = event.query.toLowerCase();

    const teacherEntry = this.teacherSubjectMap.find(
      (t) => t.teacherName.toLowerCase() === teacherName?.toLowerCase()
    );

    if (teacherEntry && teacherEntry.assignedSubjects) {
      this.filteredSubjects = teacherEntry.assignedSubjects
        .split(',')
        .map((subjectCode: string) => subjectCode.trim())
        .filter((code: string) => code.toLowerCase().includes(query));
    } else {
      this.filteredSubjects = [];
    }
  }
}
