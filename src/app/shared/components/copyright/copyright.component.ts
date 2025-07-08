import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-copyright',
  standalone: true,
  template: `
    <p
      class="copyright-text"
      [style.color]="color"
      [style.marginTop]="marginTop"
    >
      &copy;{{ currentYear }} CupsLuck Team · Pampanga State University – Porac
      Campus
    </p>
  `,
  styles: [
    `
      .copyright-text {
        font-size: 0.85rem;
        text-align: center;
      }
    `,
  ],
})
export class CopyrightComponent {
  @Input() color: string = '#888';
  @Input() marginTop: string = '2rem';
  currentYear = new Date().getFullYear();
}
