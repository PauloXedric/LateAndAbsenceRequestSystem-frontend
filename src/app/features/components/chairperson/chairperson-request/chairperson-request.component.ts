import { Component } from '@angular/core';
import {
  ApproverRolesEnum,
  RequestActionEnum,
  RequestResultEnum,
  RequestStatusEnum,
} from '@shared/_enums';
import { RequestsTableComponent } from '@shared/components';

@Component({
  selector: 'app-chairperson-request',
  imports: [RequestsTableComponent],
  template: ` <h1>Request:</h1>
    <app-requests-table
      [statusId]="RequestStatusEnum.WaitingForChairpersonApproval"
      [nextApprovalStatus]="RequestStatusEnum.WaitingForDirectorApproval"
      [rejectedStatus]="RequestStatusEnum.RejectedInChairpersonApproval"
      [roles]="ApproverRolesEnum.AcademicChairperson"
      [columns]="columns"
      [addApproveHistory]="RequestResultEnum.ApprovedByAcademicChairperson"
      [addRejectHistory]="RequestResultEnum.RejectedByAcademicChairperson"
    ></app-requests-table>`,
  styles: [
    `
      h1 {
        padding-bottom: 1rem;
      }
    `,
  ],
})
export class ChairpersonRequestComponent {
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
