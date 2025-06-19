export enum RequestStatusEnum {
  WaitingForFirstSecretaryApproval = 1,
  RejectedInFirstSecretaryApproval = 2,
  WaitingForSecondSecretaryApproval = 3,
  RejectedInSecondSecretaryApproval = 4,
  WaitingForChairpersonApproval = 5,
  RejectedInChairpersonApproval = 6,
  WaitingForDirectorApproval = 7,
  RejectedInDirectorApproval = 8,
  ApprovalComplete = 9,
  WaitingForStudentSupportingDocuments = 10,
}
