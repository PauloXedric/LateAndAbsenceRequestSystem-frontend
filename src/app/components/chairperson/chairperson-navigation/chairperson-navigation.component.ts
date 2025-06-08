import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-chairperson-navigation',
  imports: [ButtonModule, MenuModule, RouterModule],
  templateUrl: './chairperson-navigation.component.html',
  styleUrl: './chairperson-navigation.component.css'
})
export class ChairpersonNavigationComponent {


   items: MenuItem[] | undefined;
  
      ngOnInit() {
          this.items = [
              {
                  items: [
                      {
                          label: 'Request',
                          routerLink: ['chairperson-request']
                      },
                      {
                          label: 'Instructors and Courses',
                            routerLink: ['instructors']
                      },
                      {
                          label: 'History',
                            routerLink: ['history']
                      },

                  ]
              }
          ];
      }
}
