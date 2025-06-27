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
    dateOfAbsence: new Date(dateOfAbsence).toISOString().slice(0, 10),
    dateOfAttendance: new Date(dateOfAttendance).toISOString().slice(0, 10), //
    reason,
  };
}
