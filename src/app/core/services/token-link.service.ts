import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class TokenLinkService {
  private token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  initializeToken(): void {
    const tokenFromUrl = this.route.snapshot.queryParamMap.get('token');

    if (tokenFromUrl) {
      this.token = tokenFromUrl;

      const cleanUrl = this.router.url.split('?')[0];
      this.location.replaceState(cleanUrl);
    }
  }

  decodeToken(): any | null {
    try {
      return this.token ? jwtDecode(this.token) : null;
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    if (!this.token) return true;
    const decoded: any = jwtDecode(this.token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  getToken(): string | null {
    return this.token;
  }
}
