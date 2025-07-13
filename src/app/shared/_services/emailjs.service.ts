import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { map, Observable } from 'rxjs';
import { ApiService } from '@core';
import { buildEmailparams } from '@shared/_params';
import { InvitationGenTokenModel, RequestGenTokenModel } from '@shared/_models';
import { environment } from 'environments/environment';
import { ApproverRolesEnum } from '@shared/_enums';
import { RoutePathEnum } from '@core/enums/route-path.enum';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly firstServiceId = 'service_r68oqkr';
  private readonly secondServiceId = 'service_6gotjev';

  private readonly approvalTemplateId = 'template_3osa1sn';
  private readonly declinedTemplateId = 'template_xa68myd';
  private readonly resetPasswordTemplateId = 'template_mkkg1wm';

  private readonly firstPublicKey = 'cFkp2u1DISUOMgVsm';
  private readonly secondPublicKey = 'zyHtp5YTGqCpo-qlT';

  constructor(private api: ApiService) {}

  sendApprovalEmail(
    request: RequestGenTokenModel,
    token: string,
    approvedBy: ApproverRolesEnum
  ): void {
    const dlarsLink =
      approvedBy === ApproverRolesEnum.Secretary
        ? `${environment.appBaseUrl}/${RoutePathEnum.SupportingDocuments}?token=${token}`
        : null;

    const completedRequest =
      approvedBy === ApproverRolesEnum.Director
        ? `${environment.appBaseUrl}/${RoutePathEnum.CompletedRequest}?token=${token}`
        : null;

    const params = buildEmailparams(request, dlarsLink, completedRequest, {
      approvedBy,
    });

    emailjs
      .send(
        this.firstServiceId,
        this.approvalTemplateId,
        params,
        this.firstPublicKey
      )
      .then(
        (result: EmailJSResponseStatus) => {},
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
    const params = buildEmailparams(request, null, null, { declinedBy });

    emailjs
      .send(
        this.firstServiceId,
        this.declinedTemplateId,
        params,
        this.firstPublicKey
      )
      .then(
        (result: EmailJSResponseStatus) => {},
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
      .send(
        this.firstServiceId,
        this.declinedTemplateId,
        params,
        this.firstPublicKey
      )
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

  sendResetPasswordEmail(userEmail: string, token: string): void {
    const resetLink = `${environment.appBaseUrl}/${
      RoutePathEnum.ResetPassword
    }?token=${token}&email=${encodeURIComponent(userEmail)}`;

    const params = {
      requesterEmail: userEmail,
      resetLink: resetLink,
    };

    emailjs
      .send(
        this.secondServiceId,
        this.resetPasswordTemplateId,
        params,
        this.secondPublicKey
      )
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(
            `Reset password email sent to ${userEmail}:`,
            result.status
          );
        },
        (error) => {
          console.error(`Failed to send reset email to ${userEmail}:`, error);
        }
      );
  }

  generateNewToken(
    request: RequestGenTokenModel
  ): Observable<{ urlToken: string }> {
    return this.api.post<{ urlToken: string }>(
      'Token/generate-url-token',
      request
    );
  }

  generateInvitationLink(
    user: InvitationGenTokenModel
  ): Observable<{ inviteLink: string }> {
    return this.api
      .post<{ invitationToken: string }>(
        'Token/generate-invitation-token',
        user
      )
      .pipe(
        map((res) => ({
          inviteLink: `${environment.appBaseUrl}/register?token=${res.invitationToken}`,
        }))
      );
  }
}
