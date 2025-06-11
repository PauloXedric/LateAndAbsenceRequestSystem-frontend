import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MainComponent } from '../../../_layouts/main/main.component';
import { SecretarySidebarComponent } from '../secretary-sidebar/secretary-sidebar.component';

@Component({
  selector: 'app-secretary-navigation',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule,
    MainComponent,
    SecretarySidebarComponent,
  ],
  templateUrl: './secretary-navigation.component.html',
  styleUrl: './secretary-navigation.component.css',
})
export class SecretaryNavigationComponent {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  toggleSidebar(): void {
    this.isLeftSidebarCollapsed.set(!this.isLeftSidebarCollapsed());
  }
}
