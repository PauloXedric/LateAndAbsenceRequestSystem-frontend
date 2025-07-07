import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class TokenLinkService {
  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('supporting-doc-token', token);
  }

  getToken(): string | null {
    return this.token || sessionStorage.getItem('supporting-doc-token');
  }

  decodeToken(): any | null {
    try {
      return this.getToken() ? jwtDecode(this.getToken()!) : null;
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  }
}
