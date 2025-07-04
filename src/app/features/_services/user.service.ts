import { Injectable } from '@angular/core';
import { ApiService } from '@core';
import { UserListModel } from '@features/_models/user-list.model';
import { UserRegisterModel } from '@features/_models/user-register.model';
import { UserUpdateModel } from '@features/_models/user-update.model';
import { ApiResponse } from '@shared/_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  registerUSer(user: UserRegisterModel): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('UserAccount/RegisterUser', user);
  }

  getAllUsers(): Observable<UserListModel[]> {
    return this.api.get<UserListModel[]>('UserAccount');
  }

  userUpdate(data: UserUpdateModel): Observable<ApiResponse> {
    return this.api.put<ApiResponse>('UserAccount', data);
  }
}
