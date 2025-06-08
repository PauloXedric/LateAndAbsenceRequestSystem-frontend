import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-director-navigation',
  imports: [ButtonModule, RouterModule, MenuModule],
  templateUrl: './director-navigation.component.html',
  styleUrl: './director-navigation.component.css'
})
export class DirectorNavigationComponent {


    items: MenuItem[] | undefined;
    
        ngOnInit() {
            this.items = [
                {
                    items: [
                        {
                            label: 'Request',
                            routerLink: ['director-request']
                        },
                        {
                            label: 'Instructors and Courses',
                              routerLink: ['instructors']
                        },
                        {
                            label: 'History',
                              routerLink: ['history']
                        },
                        {
                            label: 'Account Management',
                              routerLink: ['account-management']
                        },
  
                    ]
                }
            ];
        }
}
