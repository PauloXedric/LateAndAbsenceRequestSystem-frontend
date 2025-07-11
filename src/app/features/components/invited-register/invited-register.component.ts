import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TokenLinkService } from '@core';
import { ToastService } from '@shared/_services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { toUserRegisterModel } from '@shared/_mappers/user-register.mapper';
import { UserService } from '@features/_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { CopyrightComponent } from '@shared/components';

@Component({
  selector: 'app-invited-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputGroupAddonModule,
    InputGroupModule,
    ButtonModule,
    InputTextModule,
    FluidModule,
    ToastModule,
    CardModule,
    PasswordModule,
    DividerModule,
    CopyrightComponent,
  ],
  templateUrl: './invited-register.component.html',
  styleUrl: './invited-register.component.css',
})
export class InvitedRegisterComponent implements OnInit {
  registerForm!: FormGroup;

  value: string | undefined = 'Disabled';
  tokenData: any = null;
  isExpired = false;
  isRegistered: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tokenLinkService: TokenLinkService,
    private toastService: ToastService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.tokenLinkService.setToken(token);
      const cleanUrl = this.router.url.split('?')[0];
      this.location.replaceState(cleanUrl);
    }
    const decoded = this.tokenLinkService.decodeToken();
    if (!decoded) {
      console.error('No valid token found');
      return;
    }
    this.tokenData = decoded;
    this.isExpired = this.tokenLinkService.isTokenExpired();

    if (this.tokenData?.userEmail) {
      this.userService.checkUserAsync(this.tokenData.userEmail).subscribe({
        next: (result) => {
          this.isRegistered = result;
        },
        error: (err) => {
          console.error('Failed to check user existence.', err);
        },
      });
    }

    this.registerForm = this.fb.group(
      {
        userCode: ['', Validators.required],
        lastName: ['', Validators.required],
        firstName: ['', Validators.required],
        role: [{ value: this.tokenData.userRole, disabled: true }],
        username: [{ value: this.tokenData.userEmail, disabled: true }],
        password: [
          '',
          Validators.compose([
            Validators.required,
            this.passwordPolicyValidator,
          ]),
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const rawValue = this.registerForm.getRawValue();
    const newUser = toUserRegisterModel(rawValue);

    this.userService.registerUSer(newUser).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
        this.registerForm.reset();
        this.isRegistered = true;
      },
      error: (err) => {
        this.toastService.showError(
          err.error.message || 'Something went wrong'
        );
      },
    });
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
}
