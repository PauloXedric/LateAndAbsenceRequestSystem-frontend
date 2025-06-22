import { Component } from '@angular/core';
import {
  RequestActionEnum,
  RequestStatusEnum,
  RolesEnum,
} from '@shared/_enums';
import { RequestsTableComponent } from '@shared/components';

@Component({
  selector: 'app-secretary-initial-request',
  standalone: true,
  imports: [RequestsTableComponent],
  template: ` <h1>Secondary Request:</h1>
    <app-requests-table
      [statusId]="RequestStatusEnum.WaitingForFirstSecretaryApproval"
      [nextApprovalStatus]="RequestStatusEnum.WaitingForSecondSecretaryApproval"
      [rejectedStatus]="RequestStatusEnum.RejectedInFirstSecretaryApproval"
      [roles]="RolesEnum.SecondSecretary"
      [columns]="columns"
    ></app-requests-table>`,
  styles: [
    `
      h1 {
        padding-bottom: 1rem;
      }
    `,
  ],
})
export class SecretaryInitialRequestComponent {
  readonly RequestActionEnum = RequestActionEnum;
  readonly RequestStatusEnum = RequestStatusEnum;
  readonly RolesEnum = RolesEnum;

  columns = [
    { field: 'studentNumber', header: 'Student Number' },
    { field: 'studentName', header: 'Student Name' },
    { field: 'courseYearSection', header: 'Course/Year/Section' },
    { field: 'dateOfAbsence', header: 'Date of Absence' },
    { field: 'dateOfAttendance', header: 'Date of Attendance' },
    { field: 'reason', header: 'Reason' },
  ];
}
