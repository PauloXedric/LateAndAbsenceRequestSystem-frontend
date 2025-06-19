import { Component } from '@angular/core';
import { RequestActionEnum } from '@shared/_enums/request-action.enum';
import { RequestStatusEnum } from '@shared/_enums/request-status.enum';
import { AdvancedRequestTableComponent } from '@shared/components';

@Component({
  selector: 'app-chairperson-request',
  imports: [AdvancedRequestTableComponent],
  template: ` <h1>Request:</h1>
    <app-advanced-request-table
      [statusId]="RequestStatusEnum.WaitingForChairpersonApproval"
      [nextApprovalStatus]="RequestStatusEnum.WaitingForDirectorApproval"
      [rejectedStatus]="RequestStatusEnum.RejectedInChairpersonApproval"
    ></app-advanced-request-table>`,
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
}
