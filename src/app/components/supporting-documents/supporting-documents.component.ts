import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-supporting-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supporting-documents.component.html',
  styleUrls: ['./supporting-documents.component.css'],
})
export class SupportingDocumentsComponent implements OnInit {
  tokenData: any = null;
  isExpired = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    let token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      token = sessionStorage.getItem('dlarsToken');
    }

    if (!token) {
      console.error('No token available');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now();
      const expiration = decoded.exp * 1000;

      if (expiration < now) {
        this.isExpired = true;
        console.warn('Token expired');
      } else {
        this.tokenData = decoded;

        sessionStorage.setItem('dlarsToken', token);

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true,
        });
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
}
