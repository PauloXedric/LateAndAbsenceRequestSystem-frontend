import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'chairperson-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmPopupModule],
  providers: [ConfirmationService, AuthService],
  templateUrl: './chairperson-sidebar.component.html',
  styleUrl: './chairperson-sidebar.component.css',
})
export class ChairpersonSidebarComponent {
  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      label: 'Request',
      routerLink: ['chairperson-request'],
      icon: PrimeIcons.INBOX,
    },
    {
      label: 'Instructors and Courses',
      routerLink: ['instructors'],
      icon: PrimeIcons.USER,
    },
    {
      label: 'History',
      routerLink: ['history'],
      icon: PrimeIcons.HOURGLASS,
    },
    {
      label: 'Log out',
      icon: PrimeIcons.SIGN_OUT,
      command: (event: Event) => this.confirmLogout(event),
    },
  ];

  confirmLogout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to logout?',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Logout',
      rejectLabel: 'Cancel',
      acceptButtonProps: {
        severity: 'danger',
        outlined: true,
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.authService.logout();
      },
      reject: () => {},
    });
  }
}
