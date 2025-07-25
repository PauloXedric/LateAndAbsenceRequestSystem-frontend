import { Component } from '@angular/core';
import {
  ApproverRolesEnum,
  RequestActionEnum,
  RequestResultEnum,
  RequestStatusEnum,
} from '@shared/_enums';
import { RequestsTableComponent } from '@shared/components';

@Component({
  selector: 'app-director-request',
  imports: [RequestsTableComponent],
  template: ` <h1>Request:</h1>
    <app-requests-table
      [statusId]="RequestStatusEnum.WaitingForDirectorApproval"
      [nextApprovalStatus]="RequestStatusEnum.ApprovalComplete"
      [rejectedStatus]="RequestStatusEnum.RejectedInDirectorApproval"
      [roles]="ApproverRolesEnum.Director"
      [columns]="columns"
      [addApproveHistory]="RequestResultEnum.ApprovedByDirector"
      [addRejectHistory]="RequestResultEnum.RejectedByDirector"
    ></app-requests-table>`,
  styles: [
    `
      h1 {
        padding-bottom: 1rem;
      }
    `,
  ],
})
export class DirectorRequestComponent {
  readonly RequestActionEnum = RequestActionEnum;
  readonly RequestStatusEnum = RequestStatusEnum;
  readonly ApproverRolesEnum = ApproverRolesEnum;
  readonly RequestResultEnum = RequestResultEnum;

  columns = [
    { field: 'studentNumber', header: 'Student Number' },
    { field: 'studentName', header: 'Student Name' },
    { field: 'reason', header: 'Reason' },
    { field: 'proofImage', header: 'Image Proof' },
    { field: 'parentValidImage', header: "Parent's ID" },
    { field: 'medicalCertificate', header: 'Med. Cert.' },
  ];
}
