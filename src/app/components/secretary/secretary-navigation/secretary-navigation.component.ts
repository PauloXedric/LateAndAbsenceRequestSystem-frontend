import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';




@Component({
  selector: 'app-secretary-navigation',
  standalone: true,
  imports: [ButtonModule, MenuModule, RouterModule],
  templateUrl: './secretary-navigation.component.html',
  styleUrl: './secretary-navigation.component.css'
})
export class SecretaryNavigationComponent   {


      items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                items: [
                    {
                        label: 'Initial Request',
                        routerLink: ['initial-request']
                    },
                    {
                        label: 'Secondary Request',
                          routerLink: ['secondary-request']
                    }
                ]
            }
        ];
    }
}
