import { Component, OnInit } from '@angular/core';
import { UserLoginModel } from '../../_models/user-login.model';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ButtonModule,
    NgIf,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  userLoginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitUserLogin(): void {
    if (this.userLoginForm.invalid) {
      this.userLoginForm.markAllAsTouched();
      return;
    }

    const credentials: UserLoginModel = this.userLoginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        const roles = this.authService.getUserRoles();
        if (roles.includes('Secretary')) {
          this.router.navigate(['/secretary']);
        } else if (roles.includes('chairperson')) {
          this.router.navigate(['/chairperson']);
        } else if (roles.includes('Director')) {
          this.router.navigate(['/director']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      error: () => {
        alert('Login failed. Check your credentials.');
      },
    });
  }
}
