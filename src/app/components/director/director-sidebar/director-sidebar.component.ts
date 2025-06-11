import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './director-sidebar.component.html',
  styleUrl: './director-sidebar.component.css',
})
export class DirectorSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      label: 'Request',
      routerLink: ['director-request'],
      icon: PrimeIcons.DESKTOP,
    },
    {
      label: 'Instructors and Courses',
      routerLink: ['instructors'],
      icon: PrimeIcons.USER,
    },
    {
      label: 'History',
      routerLink: ['history'],
      icon: PrimeIcons.TIMES,
    },
    {
      label: 'Account Management',
      routerLink: ['account-management'],
      icon: PrimeIcons.TRASH,
    },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
