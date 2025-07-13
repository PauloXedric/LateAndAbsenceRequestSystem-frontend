import { Component, OnInit } from '@angular/core';
import { UserLoginModel } from '../../_models/user/user-login.model';
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
import { AuthService } from '@core';
import { EmailService, ToastService } from '@shared/_services';
import { FluidModule } from 'primeng/fluid';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { CommonModule } from '@angular/common';
import { CopyrightComponent } from '@shared/components';
import { DialogModule } from 'primeng/dialog';
import { UserService } from '@features/_services/user.service';
import { UserRoleEnum } from '@core/enums/roles.enum';
import { RoutePathEnum } from '@core/enums/route-path.enum';

@Component({
  selector: 'app-sign-in',
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ButtonModule,
    FluidModule,
    InputGroupAddonModule,
    InputGroupModule,
    CopyrightComponent,
    DialogModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  userLoginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;

  visible = false;
  position: 'top' = 'top';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
    private emailjsService: EmailService
  ) {}

  ngOnInit(): void {
    this.userLoginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
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
        if (roles.includes(UserRoleEnum.Secretary)) {
          this.router.navigate([RoutePathEnum.Secretary]);
        } else if (roles.includes(UserRoleEnum.Chairperson)) {
          this.router.navigate([RoutePathEnum.Chairperson]);
        } else if (roles.includes(UserRoleEnum.Director)) {
          this.router.navigate([RoutePathEnum.Director]);
        } else if (roles.includes(UserRoleEnum.Developer)) {
          this.router.navigate([RoutePathEnum.Developer]);
        } else {
          this.router.navigate([RoutePathEnum.Unauthorized]);
        }
      },
      error: (err) => {
        if (err.status === 403) {
          this.toastService.showInfo(err.error?.message);
        } else if (err.status === 404) {
          this.toastService.showError(err.error?.message);
        } else {
          this.toastService.showError(
            'Something went wrong. Please try again.'
          );
        }
      },
    });
  }

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onForgotPasswordClick(event: Event) {
    event.preventDefault();
    this.showDialog(this.position);
  }

  showDialog(position: typeof this.position) {
    this.position = position;
    this.visible = true;
  }

  sendResetLink(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    const email = this.forgotPasswordForm.get('username')?.value;

    this.userService.checkUserAsync(email).subscribe({
      next: (userExists) => {
        if (userExists) {
          this.toastService.showSuccess(
            'Reset password link sent! Please check your email inbox to proceed.'
          );
          const username = this.forgotPasswordForm.value;
          this.userService.requestResetPassword(username).subscribe({
            next: (res) => {
              const { token, username } = res;
              this.emailjsService.sendResetPasswordEmail(username, token);
            },
          });

          this.visible = false;
        }
        if (!userExists) {
          this.toastService.showError(
            'No account found with that email address.'
          );
        }
        return;
      },
      error: () => {
        this.toastService.showError(
          'Something went wrong. Please try again later.'
        );
      },
    });
  }
}
