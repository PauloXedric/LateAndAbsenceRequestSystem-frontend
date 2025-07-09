// src/app/services/auth.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '@core';
import { ApiResponse } from '@shared/_models';
import { UserRegisterModel } from '@features/_models/user-register.model';
import { UserListModel } from '@features/_models/user-list.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwtToken';
  private roleKey = 'userRoles';
  private api = inject(ApiService);
  private jwtHelper = inject(JwtHelperService);
  public isLoggedIn$ = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.api.post<any>('UserAccount/login', credentials).pipe(
      tap((res) => {
        const token = res.tokenString;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          this.isLoggedIn$.next(true);
        } else {
          console.error('Token not found in login response:', res);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn$.next(false);
    this.router.navigate(['/sign-in']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    const decoded = this.jwtHelper.decodeToken(token);

    const roles =
      decoded?.role ||
      decoded?.[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] ||
      decoded?.['roles'] ||
      decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];

    return roles ? (Array.isArray(roles) ? roles : [roles]) : [];
  }

  hasRole(expectedRoles: string[]): boolean {
    const roles = this.getUserRoles();
    return expectedRoles.some((r) => roles.includes(r));
  }
}
