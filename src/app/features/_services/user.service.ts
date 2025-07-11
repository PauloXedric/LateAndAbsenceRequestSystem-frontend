import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import {
  ResetPasswordModel,
  ResetPasswordRequestModel,
  ResetTokenValidationModel,
  UserListModel,
  UserRegisterModel,
  UserUpdateModel,
} from '@features/_models';
import { ApiResponse } from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  registerUSer(user: UserRegisterModel): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('UserAccount/register-user', user);
  }

  getAllUsers(): Observable<UserListModel[]> {
    return this.api.get<UserListModel[]>('UserAccount/all');
  }

  checkUserAsync(username: string): Observable<boolean> {
    return this.api.get<boolean>(`UserAccount/check-user/${username}`);
  }

  updateUserStatusAndRole(data: UserUpdateModel): Observable<ApiResponse> {
    return this.api.put<ApiResponse>('UserAccount', data);
  }

  requestResetPassword(
    username: ResetPasswordRequestModel
  ): Observable<{ token: string; username: string }> {
    return this.api.post<{ token: string; username: string }>(
      'UserAccount/request-reset-password',
      username
    );
  }

  validateResetToken(
    resetToken: ResetTokenValidationModel
  ): Observable<boolean> {
    return this.api.post<boolean>(
      'UserAccount/validate-reset-token',
      resetToken
    );
  }

  resetPassword(reset: ResetPasswordModel): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('UserAccount/reset-password', reset);
  }

  deleteUser(email: string): Observable<ApiResponse> {
    return this.api.delete<ApiResponse>(`UserAccount/${email}`);
  }
}
