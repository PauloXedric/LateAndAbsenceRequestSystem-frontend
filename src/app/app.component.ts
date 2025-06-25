import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmationDialogComponent } from '@shared/components';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    ImageModule,
    RouterModule,
    RouterOutlet,
    ToastModule,
    ConfirmationDialogComponent,
  ],
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DLARS';
}
