import { Component } from '@angular/core';
import { RequestActionEnum } from '@shared/_enums/request-action.enum';
import { RequestStatusEnum } from '@shared/_enums/request-status.enum';
import { AdvancedRequestTableComponent } from '@shared/components';

@Component({
  selector: 'app-secretary-secondary-request',
  standalone: true,
  imports: [AdvancedRequestTableComponent],
  template: ` <h1>Secondary Request:</h1>
    <app-advanced-request-table
      [statusId]="RequestStatusEnum.WaitingForSecondSecretaryApproval"
      [nextApprovalStatus]="RequestStatusEnum.WaitingForChairpersonApproval"
      [rejectedStatus]="RequestStatusEnum.RejectedInSecondSecretaryApproval"
    ></app-advanced-request-table>`,
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
}
