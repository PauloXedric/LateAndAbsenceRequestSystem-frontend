import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ToastService } from '@shared/_services';
import { UserService } from '@features/_services/user.service';
import { CopyrightComponent } from '@shared/components';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FluidModule } from 'primeng/fluid';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ResetPasswordModel } from '@features/_models';
import { IdentityTokenService } from '@core/services/identity-token.service'; // 🔄 Import the new service

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FluidModule,
    ToastModule,
    DividerModule,
    CopyrightComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isExpired = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastService: ToastService,
    private userService: UserService,
    private identityTokenService: IdentityTokenService
  ) {}

  ngOnInit(): void {
    let rawToken = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (rawToken && email) {
      rawToken = decodeURIComponent(rawToken).replace(/ /g, '+');

      this.identityTokenService.setTokenAndEmail(rawToken, email);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true,
      });

      this.userService
        .validateResetToken({ token: rawToken, email })
        .subscribe({
          next: (isValid) => {
            this.isExpired = !isValid;
          },
          error: () => {
            this.isExpired = true;
          },
        });
    } else {
      this.isExpired = true;
    }

    this.resetForm = this.fb.group(
      {
        username: [
          { value: this.identityTokenService.getEmail(), disabled: true },
        ],
        password: ['', [Validators.required, this.passwordPolicyValidator]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordPolicyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
    const hasMinLength = value.length >= 8;

    const valid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      hasMinLength;

    return valid
      ? null
      : {
          passwordPolicy: {
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
            hasMinLength,
          },
        };
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const password = this.resetForm.value.password;
    const token = this.identityTokenService.getToken();
    const email = this.identityTokenService.getEmail();

    if (!email || !token) {
      return;
    }

    const resetData: ResetPasswordModel = {
      email: email,
      token: token,
      newPassword: password,
    };
    console.log(resetData);
    this.userService.resetPassword(resetData).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.identityTokenService.clear();
        this.success = true;
      },
      error: (err) => {
        this.toastService.showError(
          err.error?.message || 'Something went wrong.'
        );
      },
    });
  }
}
