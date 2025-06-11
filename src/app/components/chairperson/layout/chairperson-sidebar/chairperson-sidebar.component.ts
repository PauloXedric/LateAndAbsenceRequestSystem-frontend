import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'chairperson-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chairperson-sidebar.component.html',
  styleUrl: './chairperson-sidebar.component.css',
})
export class ChairpersonSidebarComponent {
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
  ];
}
