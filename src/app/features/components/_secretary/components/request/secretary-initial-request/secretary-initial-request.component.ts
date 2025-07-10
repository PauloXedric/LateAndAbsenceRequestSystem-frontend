import { Component } from '@angular/core';
import {
  ApproverRolesEnum,
  RequestActionEnum,
  RequestResultEnum,
  RequestStatusEnum,
} from '@shared/_enums';
import { RequestsTableComponent } from '@shared/components';

@Component({
  selector: 'app-secretary-initial-request',
  standalone: true,
  imports: [RequestsTableComponent],
  template: ` <h1>Initial Request:</h1>
    <app-requests-table
      [statusId]="RequestStatusEnum.WaitingForFirstSecretaryApproval"
      [nextApprovalStatus]="
        RequestStatusEnum.WaitingForStudentSupportingDocuments
      "
      [rejectedStatus]="RequestStatusEnum.RejectedInFirstSecretaryApproval"
      [roles]="ApproverRolesEnum.Secretary"
      [columns]="columns"
      [addApproveHistory]="RequestResultEnum.ApprovedBySecretaryInitial"
      [addRejectHistory]="RequestResultEnum.RejectedBySecretaryInitial"
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
  readonly ApproverRolesEnum = ApproverRolesEnum;
  readonly RequestResultEnum = RequestResultEnum;

  columns = [
    { field: 'studentNumber', header: 'Student Number' },
    { field: 'studentName', header: 'Student Name' },
    { field: 'courseYearSection', header: 'Course/Year/Section' },
    { field: 'dateOfAbsence', header: 'Date of Absence' },
    { field: 'dateOfAttendance', header: 'Date of Attendance' },
    { field: 'reason', header: 'Reason' },
  ];
}
