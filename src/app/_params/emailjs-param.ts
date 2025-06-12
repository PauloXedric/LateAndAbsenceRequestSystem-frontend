import { RequestReadModel } from '../_models/request-read.model';

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
  dlarsLink: string;
}

export function buildEmailparams(request: RequestReadModel): EmailjsParams {
  const requesterEmail = `${request.studentNumber}@dhvsu.edu.ph`;
  const dlarsLink = 'http://localhost:4200/request';

  return {
    studentName: request.studentName,
    studentNumber: request.studentNumber,
    courseYearSection: request.courseYearSection,
    teacher: request.teacher,
    subject: request.subjectCode,
    dateOfAbsence: request.dateOfAbsence,
    reason: request.reason,
    requesterEmail,
    dlarsLink,
  };
}
