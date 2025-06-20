import { RequestReadModel, RequestGenTokenModel } from '@shared/_models';

export function toRequestGenTokenModel(
  request: RequestReadModel
): RequestGenTokenModel {
  const {
    requestId,
    studentNumber,
    studentName,
    courseYearSection,
    teacher,
    subjectCode,
    dateOfAbsence,
    dateOfAttendance,
    reason,
  } = request;

  return {
    requestId,
    studentNumber,
    studentName,
    courseYearSection,
    teacher,
    subjectCode,
    dateOfAbsence,
    dateOfAttendance,
    reason,
  };
}
