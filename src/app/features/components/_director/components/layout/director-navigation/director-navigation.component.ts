import { Component, HostListener, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DirectorSidebarComponent } from '../director-sidebar/director-sidebar.component';
import { MainComponent, NotificationComponent } from '@shared/components';
import { RequestReadModel } from '@shared/_models';
import { Observable } from 'rxjs';
import { SignalrRequestService } from '@shared/_hubs/signalr-request.service';

@Component({
  selector: 'app-director-navigation',
  imports: [
    ButtonModule,
    RouterModule,
    DirectorSidebarComponent,
    MainComponent,
    NotificationComponent,
  ],
  templateUrl: './director-navigation.component.html',
  styleUrl: './director-navigation.component.css',
})
export class DirectorNavigationComponent {
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
