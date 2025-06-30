import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InvitationGenTokenModel } from '@shared/_models';
import { EmailService, ToastService } from '@shared/_services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [
    CardModule,
    ToolbarModule,
    InputGroupModule,
    InputGroupAddonModule,
    FluidModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css',
})
export class AccountManagementComponent implements OnInit {
  newUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      email: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  addNewUser(): void {
    if (this.newUserForm.invalid) return;

    const formValue = this.newUserForm.value;

    const tokenModel: InvitationGenTokenModel = {
      userEmail: formValue.email,
      userRole: formValue.role,
    };

    this.emailService.generateInvitationLink(tokenModel).subscribe({
      next: (response) => {
        const inviteLink = response.inviteLink;
        // this.emailService.sendInvitationEmail(
        //   tokenModel.userEmail,
        //   tokenModel.userRole,
        //   inviteLink
        // );
        this.toastService.showSuccess('Invitation send successfully');
        this.newUserForm.reset();
      },
      error: (err) => {
        this.toastService.showError('Failed to send invitation');
      },
    });
  }
}
