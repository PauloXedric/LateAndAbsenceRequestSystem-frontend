import { Component, HostListener, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ChairpersonSidebarComponent } from '../chairperson-sidebar/chairperson-sidebar.component';
import { MainComponent } from '../../../_layouts/main/main.component';

@Component({
  selector: 'app-chairperson-navigation',
  imports: [
    ButtonModule,
    MenuModule,
    RouterModule,
    ChairpersonSidebarComponent,
    MainComponent,
  ],
  templateUrl: './chairperson-navigation.component.html',
  styleUrl: './chairperson-navigation.component.css',
})
export class ChairpersonNavigationComponent {
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
