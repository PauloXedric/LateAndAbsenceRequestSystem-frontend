export enum RequestStatusEnum {
  WaitingForFirstSecretaryApproval = 'WaitingForFirstSecretaryApproval',
  RejectedInFirstSecretaryApproval = 'RejectedInFirstSecretaryApproval',
  WaitingForSecondSecretaryApproval = 'WaitingForSecondSecretaryApproval',
  RejectedInSecondSecretaryApproval = 'RejectedInSecondSecretaryApproval',
  WaitingForChairpersonApproval = 'WaitingForChairpersonApproval',
  RejectedInChairpersonApproval = 'RejectedInChairpersonApproval',
  WaitingForDirectorApproval = 'WaitingForDirectorApproval',
  RejectedInDirectorApproval = 'RejectedInDirectorApproval',
  ApprovalComplete = 'ApprovalComplete',
  WaitingForStudentSupportingDocuments = 'WaitingForStudentSupportingDocuments',
}
