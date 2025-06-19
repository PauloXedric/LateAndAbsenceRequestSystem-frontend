import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-student-number-search-input',
  imports: [CommonModule, InputTextModule, IconField, InputIcon],
  standalone: true,
  template: `
    <p-iconfield>
      <p-inputicon styleClass="pi pi-search"></p-inputicon>
      <input
        type="text"
        pInputText
        placeholder="Search student number"
        (input)="onInput($event)"
      />
    </p-iconfield>
  `,
})
export class StudentNumberSearchInputComponent {
  @Output() filterChanged = new EventEmitter<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterChanged.emit(value);
  }
}
