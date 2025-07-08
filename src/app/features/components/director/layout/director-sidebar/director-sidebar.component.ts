import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core';
import { CopyrightComponent } from '@shared/components';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'director-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, ConfirmPopupModule, CopyrightComponent],
  providers: [AuthService, ConfirmationService],
  templateUrl: './director-sidebar.component.html',
  styleUrl: './director-sidebar.component.css',
})
export class DirectorSidebarComponent {
  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      label: 'Request',
      routerLink: ['director-request'],
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
      label: 'Account Management',
      routerLink: ['account-management'],
      icon: PrimeIcons.USER_EDIT,
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
