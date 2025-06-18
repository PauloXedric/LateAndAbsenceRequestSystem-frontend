import { Component, OnInit } from '@angular/core';
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
import { RequestCreateModel } from '../../_models/request-create.model';
import { NgIf } from '@angular/common';
import { RequestService } from '@features/_services/request.service';

@Component({
  selector: 'request-form',
  standalone: true,
  templateUrl: './request.component.html',
  imports: [
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    NgIf,
    ReactiveFormsModule,
    DatePickerModule,
  ],
  styleUrls: ['./request.component.css'],
})
export class RequestComponent implements OnInit {
  dateOfAbsence: Date | undefined;
  dateOfAttendance: Date | undefined;

  requestForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
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
  }

  submitRequestForm(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const newRequest: RequestCreateModel = this.requestForm.value;
    console.log('Data being sent to backend:', newRequest);

    this.requestService.addNewRequest(newRequest).subscribe({
      next: (response) => console.log('✅ API response:', response),
      error: (err) => console.error('❌ API error:', err),
    });
  }
}
