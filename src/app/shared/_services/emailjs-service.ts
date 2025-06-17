import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { RequestReadModel } from '../_models/request-read-model';
import { Observable } from 'rxjs';
import { ApiService } from '@core';
import { buildEmailparams, EmailjsParams } from '@shared/_params';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly serviceId = 'service_r68oqkr';
  private readonly approvalTemplateId = 'template_3osa1sn';
  private readonly declinedTemplateId = 'template_xa68myd';
  private readonly publicKey = 'cFkp2u1DISUOMgVsm';

  constructor(private api: ApiService) {}

  sendApprovalEmail(request: RequestReadModel, token: string): void {
    const dlarsLink = `http://localhost:4200/supporting-documents?token=${token}`;
    const params: EmailjsParams = buildEmailparams(request, dlarsLink);

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

  sendDeclineEmail(request: RequestReadModel, token: string): void {
    const dlarsLink = `http://localhost:4200/supporting-documents?token=${token}`;
    const params: EmailjsParams = buildEmailparams(request, dlarsLink);

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
            `Failed to send rejection email sent to ${params.requesterEmail}:`,
            error
          );
        }
      );
  }

  generateUrlToken(request: RequestReadModel): Observable<{ token: string }> {
    return this.api.post<{ token: string }>(`Token/GenerateUrlToken`, request);
  }
}
