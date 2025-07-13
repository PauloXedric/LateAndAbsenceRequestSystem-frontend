import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenLinkService } from '@core';
import { DateFormatPipe } from '@shared/_pipes/date-format.pipe';
import { CopyrightComponent } from '@shared/components';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { Location } from '@angular/common';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-completed-request-view',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    ToastModule,
    DateFormatPipe,
    CopyrightComponent,
    MessageModule,
  ],
  templateUrl: './completed-request-view.component.html',
  styleUrl: './completed-request-view.component.css',
})
export class CompletedRequestViewComponent implements OnInit {
  tokenData: any = null;
  isExpired: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private tokenLinkService: TokenLinkService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.tokenLinkService.setToken(token);
      const cleanUrl = this.router.url.split('?')[0];
      this.location.replaceState(cleanUrl);
    }

    const decoded = this.tokenLinkService.decodeToken();

    this.tokenData = decoded;
    this.isExpired = this.tokenLinkService.isTokenExpired();
  }
}
