import { formatDate } from '@shared/_helpers/date.helper';
import { RequestGenTokenModel } from '@shared/_models';

export interface EmailjsParams {
  [key: string]: any;
  studentName: string;
  studentNumber: string;
  courseYearSection: string;
  teacher: string;
  subject: string;
  dateOfAbsence: string;
  reason: string;
  requesterEmail: string;
  approvedBy?: string;
  declinedBy?: string;
  date: string;
  // ❌ no `dlarsLink?: string` in interface — keep dynamic
}

export function buildEmailparams(
  request: RequestGenTokenModel,
  dlarsLink: string | null,
  options?: { declinedBy?: string; approvedBy?: string }
): EmailjsParams {
  const requesterEmail = `${request.studentNumber}@dhvsu.edu.ph`;
  const date = formatDate(new Date());

  const params: EmailjsParams = {
    studentName: request.studentName,
    studentNumber: request.studentNumber,
    courseYearSection: request.courseYearSection,
    teacher: request.teacher,
    subject: request.subjectCode,
    dateOfAbsence: request.dateOfAbsence,
    reason: request.reason,
    requesterEmail,
    date,
    declinedBy: options?.declinedBy,
    approvedBy: options?.approvedBy,
  };

  // ✅ Only add dlarsLink if it's not null
  if (dlarsLink) {
    params['dlarsLink'] = dlarsLink;
  }

  return params;
}
