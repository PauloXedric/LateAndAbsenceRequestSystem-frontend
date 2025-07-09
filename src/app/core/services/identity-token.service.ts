import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IdentityTokenService {
  private readonly TOKEN_KEY = 'identity-reset-token';
  private readonly EMAIL_KEY = 'identity-reset-email';

  setTokenAndEmail(token: string, email: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.EMAIL_KEY, email);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getEmail(): string | null {
    return sessionStorage.getItem(this.EMAIL_KEY);
  }

  clear(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.EMAIL_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    const email = this.getEmail();
    return !!token && !!email;
  }
}
