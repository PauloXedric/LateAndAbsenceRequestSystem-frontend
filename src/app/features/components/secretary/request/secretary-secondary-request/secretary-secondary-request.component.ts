import { Component } from '@angular/core';
import {
  ApproverRolesEnum,
  RequestActionEnum,
  RequestResultEnum,
  RequestStatusEnum,
} from '@shared/_enums';

import { RequestsTableComponent } from '@shared/components';

@Component({
  selector: 'app-secretary-secondary-request',
  standalone: true,
  imports: [RequestsTableComponent],
  template: ` <h1>Secondary Request:</h1>
    <app-requests-table
      [statusId]="RequestStatusEnum.WaitingForSecondSecretaryApproval"
      [nextApprovalStatus]="RequestStatusEnum.WaitingForChairpersonApproval"
      [rejectedStatus]="RequestStatusEnum.RejectedInSecondSecretaryApproval"
      [roles]="ApproverRolesEnum.SecondSecretary"
      [columns]="columns"
      [addApproveHistory]="RequestResultEnum.ApprovedBySecretarySecondReview"
      [addRejectHistory]="RequestResultEnum.RejectedBySecretarySecondReview"
    ></app-requests-table>`,
  styles: [
    `
      h1 {
        padding-bottom: 1rem;
      }
    `,
  ],
})
export class SecretarySecondaryRequestComponent {
  readonly RequestActionEnum = RequestActionEnum;
  readonly RequestStatusEnum = RequestStatusEnum;
  readonly ApproverRolesEnum = ApproverRolesEnum;
  readonly RequestResultEnum = RequestResultEnum;

  columns = [
    { field: 'studentNumber', header: 'Student Number' },
    { field: 'studentName', header: 'Student Name' },
    { field: 'courseYearSection', header: 'Course/Year/Section' },
    { field: 'proofImage', header: 'Image Proof' },
    { field: 'parentValidImage', header: "Parent's ID" },
    { field: 'medicalCertificate', header: 'Med. Cert.' },
  ];
}
