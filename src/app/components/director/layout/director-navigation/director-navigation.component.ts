import { Component, HostListener, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DirectorSidebarComponent } from '../director-sidebar/director-sidebar.component';
import { MainComponent } from '../../../_layouts/main/main.component';

@Component({
  selector: 'app-director-navigation',
  imports: [
    ButtonModule,
    RouterModule,
    MenuModule,
    DirectorSidebarComponent,
    MainComponent,
  ],
  templateUrl: './director-navigation.component.html',
  styleUrl: './director-navigation.component.css',
})
export class DirectorNavigationComponent {
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
