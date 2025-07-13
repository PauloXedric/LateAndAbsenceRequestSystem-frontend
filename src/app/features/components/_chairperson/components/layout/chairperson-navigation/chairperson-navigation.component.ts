import { Component, HostListener, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ChairpersonSidebarComponent } from '../chairperson-sidebar/chairperson-sidebar.component';
import { MainComponent, NotificationComponent } from '@shared/components';
import { Observable } from 'rxjs';
import { RequestReadModel } from '@shared/_models';
import { SignalrRequestService } from '@core/_hubs/signalr-request.service';

@Component({
  selector: 'app-chairperson-navigation',
  imports: [
    ButtonModule,
    MenuModule,
    RouterModule,
    ChairpersonSidebarComponent,
    MainComponent,
    NotificationComponent,
  ],
  templateUrl: './chairperson-navigation.component.html',
  styleUrl: './chairperson-navigation.component.css',
})
export class ChairpersonNavigationComponent {
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
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    this.newRequests$ = this.signalrRequestService.newRequests$;
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
