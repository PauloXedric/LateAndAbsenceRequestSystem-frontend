import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { RequestReadModel } from '../_models/request-read.model';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly serviceId = 'service_r68oqkr';
  private readonly templateId = 'template_3osa1sn';
  private readonly publicKey = 'cFkp2u1DISUOMgVsm';

  sendApprovalEmail(request: RequestReadModel): void {
    const email = `${request.studentNumber}@dhvsu.edu.ph`;

    emailjs
      .send(
        this.serviceId,
        this.templateId,
        {
          studentName: request.studentName,
          studentNumber: request.studentNumber,
          courseYearSection: request.courseYearSection,
          teacher: request.teacher,
          subject: request.subjectCode,
          dateOfAbsence: request.dateOfAbsence,
          reason: request.reason,
          requesterEmail: email,
        },
        this.publicKey
      )
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(`Email sent to ${email}:`, result.status);
        },
        (error) => {
          console.error(`Failed to send email to ${email}:`, error);
        }
      );
  }
}
