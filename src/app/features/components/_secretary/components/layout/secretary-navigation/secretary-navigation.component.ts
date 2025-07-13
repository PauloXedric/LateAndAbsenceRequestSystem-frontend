import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SecretarySidebarComponent } from '../secretary-sidebar/secretary-sidebar.component';
import { MainComponent, NotificationComponent } from '@shared/components';
import { SignalrRequestService } from '@core/_hubs/signalr-request.service';
import { RequestReadModel } from '@shared/_models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secretary-navigation',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule,
    MainComponent,
    SecretarySidebarComponent,
    NotificationComponent,
  ],
  templateUrl: './secretary-navigation.component.html',
  styleUrl: './secretary-navigation.component.css',
})
export class SecretaryNavigationComponent {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  showNotifications = false;
  newRequests$!: Observable<RequestReadModel[]>;

  constructor(private signalrRequestService: SignalrRequestService) {}

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.newRequests$ = this.signalrRequestService.newRequests$;
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  toggleSidebar(): void {
    this.isLeftSidebarCollapsed.set(!this.isLeftSidebarCollapsed());
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (!this.showNotifications) {
      this.signalrRequestService.clearNewRequests();
    }
  }

  closeNotifications(): void {
    this.showNotifications = false;
    this.signalrRequestService.clearNewRequests();
  }
}
