export interface RequestReadModel {
  requestId: number;
  studentNumber: string;
  studentName: string;
  courseYearSection: string;
  teacher: string;
  subjectCode: string;
  dateOfAbsence: string;
  dateOfAttendance: string;
  reason: string;
  proofImage: string;
  parentValidImage: string;
  medicalCertificate?: string;
}
