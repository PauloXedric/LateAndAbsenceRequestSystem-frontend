import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [ImageModule, RouterModule, RouterOutlet, ToastModule],
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DLARS';
}
