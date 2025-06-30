import { UserRegisterModel } from '@shared/_models';

export function toUserRegisterModel(form: any): UserRegisterModel {
  return {
    username: form.username,
    password: form.password,
    role: form.role,
    userCode: form.userCode,
    lastName: form.lastName,
    firstName: form.firstName,
  };
}
