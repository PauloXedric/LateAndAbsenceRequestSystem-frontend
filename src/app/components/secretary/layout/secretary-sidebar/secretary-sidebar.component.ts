import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-secretary-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './secretary-sidebar.component.html',
  styleUrl: './secretary-sidebar.component.css',
})
export class SecretarySidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      label: 'Initial Request',
      routerLink: ['initial-request'],
      icon: PrimeIcons.INBOX,
    },
    {
      label: 'Secondary Request',
      routerLink: ['secondary-request'],
      icon: PrimeIcons.SEND,
    },
  ];
}
