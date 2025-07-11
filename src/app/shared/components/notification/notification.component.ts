import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RequestReadModel } from '@shared/_models';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  @Input() newRequests$!: Observable<RequestReadModel[]>;
  @Input() showNotifications = false;

  @Input() toggleNotifications!: () => void;
}
