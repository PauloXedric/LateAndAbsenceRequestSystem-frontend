// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwtToken';
  private roleKey = 'userRoles'; 
  public isLoggedIn$ = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:51564/api/UserAccount/Login', credentials).pipe( 
      tap(res => {
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
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return atob(str);
  }

 getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const base64Payload = token.split('.')[1];
    const decodedPayload = this.base64UrlDecode(base64Payload);
    const payload = JSON.parse(decodedPayload);
    console.log('Decoded JWT payload:', payload); 

    const roles = payload.role
      || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      || payload['roles']
      || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];

    return roles ? (Array.isArray(roles) ? roles : [roles]) : [];
  }


  hasRole(expectedRoles: string[]): boolean {
    const roles = this.getUserRoles();
    return expectedRoles.some(r => roles.includes(r));
  }
}

