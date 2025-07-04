import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { map, Observable } from 'rxjs';
import { ApiService } from '@core';
import { buildEmailparams } from '@shared/_params';
import { InvitationGenTokenModel, RequestGenTokenModel } from '@shared/_models';
import { environment } from 'environments/environment';
import { ApproverRolesEnum } from '@shared/_enums';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly serviceId = 'service_r68oqkr';
  private readonly approvalTemplateId = 'template_3osa1sn';
  private readonly declinedTemplateId = 'template_xa68myd';
  private readonly publicKey = 'cFkp2u1DISUOMgVsm';

  constructor(private api: ApiService) {}

  sendApprovalEmail(
    request: RequestGenTokenModel,
    token: string,
    approvedBy: ApproverRolesEnum
  ): void {
    const dlarsLink =
      approvedBy === ApproverRolesEnum.Secretary
        ? `${environment.appBaseUrl}/supporting-documents?token=${token}`
        : null;

    const params = buildEmailparams(request, dlarsLink, { approvedBy });

    emailjs
      .send(this.serviceId, this.approvalTemplateId, params, this.publicKey)
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(
            `Approval email sent to ${params.requesterEmail}:`,
            result.status
          );
        },
        (error) => {
          console.error(
            `Failed to send approval email to ${params.requesterEmail}:`,
            error
          );
        }
      );
  }

  sendDeclineEmail(
    request: RequestGenTokenModel,
    declinedBy: ApproverRolesEnum
  ): void {
    const params = buildEmailparams(request, null, { declinedBy });

    emailjs
      .send(this.serviceId, this.declinedTemplateId, params, this.publicKey)
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(
            `Decline email sent to ${params.requesterEmail}:`,
            result.status
          );
        },
        (error) => {
          console.error(
            `Failed to send rejection email to ${params.requesterEmail}:`,
            error
          );
        }
      );
  }

  sendInvitationEmail(
    newUserEmail: string,
    userRole: string,
    inviteLink: string
  ): void {
    const params = {
      isInvite: 'true',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      userRole: String(userRole),
      requesterEmail: String(newUserEmail),
      inviteLink: String(inviteLink),
    };

    emailjs
      .send(this.serviceId, this.declinedTemplateId, params, this.publicKey)
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(
            `Invitation email sent to ${newUserEmail}:`,
            result.status
          );
        },
        (error) => {
          console.error(
            `Failed to send invitation email to ${newUserEmail}:`,
            error
          );
        }
      );
  }

  generateNewToken(
    request: RequestGenTokenModel
  ): Observable<{ urlToken: string }> {
    return this.api.post<{ urlToken: string }>(
      `Token/GenerateUrlToken`,
      request
    );
  }

  generateInvitationLink(
    user: InvitationGenTokenModel
  ): Observable<{ inviteLink: string }> {
    return this.api
      .post<{ invitationToken: string }>('Token/GenerateInvitationLink', user)
      .pipe(
        map((res) => ({
          inviteLink: `${environment.appBaseUrl}/register?token=${res.invitationToken}`,
        }))
      );
  }
}
