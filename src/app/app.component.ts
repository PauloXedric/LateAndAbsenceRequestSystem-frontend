import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { RouterModule, RouterOutlet } from '@angular/router';





@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [ImageModule, RouterModule, RouterOutlet],
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'DLARS';


}