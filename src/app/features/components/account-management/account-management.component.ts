import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserRoleEnum } from '@core/enums/roles.enum';
import { UserStatusEnum } from '@features/_enums/user-status.enum';
import { UserListModel } from '@features/_models/user/user-list.model';
import { InvitationGenTokenModel } from '@shared/_models';
import {
  ConfirmationDialogService,
  EmailService,
  ToastService,
} from '@shared/_services';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { UserService } from '@features/_services/user.service';
import { UserUpdateModel } from '@features/_models/user/user-update.model';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AuthService } from '@core';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TableModule,
    CardModule,
    ToolbarModule,
    InputGroupModule,
    InputGroupAddonModule,
    FluidModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    TagModule,
    ConfirmPopupModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css',
})
export class AccountManagementComponent implements OnInit {
  @ViewChild('userTable') userTable: any;

  newUserForm!: FormGroup;
  userListForm!: FormGroup;
  userData: UserListModel[] = [];
  clonedUsers: { [key: string]: UserListModel } = {};
  editingRowIndex: number | null = null;
  UserRoleEnum = UserRoleEnum;

  roles: SelectItem[] = [
    { label: UserRoleEnum.Secretary, value: UserRoleEnum.Secretary },
    { label: UserRoleEnum.Chairperson, value: UserRoleEnum.Chairperson },
    { label: UserRoleEnum.Director, value: UserRoleEnum.Director },
  ];

  statuses: SelectItem[] = [
    { label: UserStatusEnum.Active, value: UserStatusEnum.Active },
    { label: UserStatusEnum.Inactive, value: UserStatusEnum.Inactive },
  ];

  get users(): FormArray {
    return this.userListForm.get('users') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private userService: UserService,
    private toastService: ToastService,
    private confirmationService: ConfirmationDialogService,
    private confirm: ConfirmationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    this.userListForm = this.fb.group({
      users: this.fb.array([]),
    });

    this.loadUserList();
  }

  loadUserList(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.userData = data;
      const formGroups = data.map((user) => this.createUserForm(user));
      const formArray = this.fb.array(formGroups);
      this.userListForm.setControl('users', formArray);
    });
  }

  createUserForm(user: UserListModel): FormGroup {
    return this.fb.group({
      userCode: [user.userCode],
      lastName: [user.lastName],
      firstName: [user.firstName],
      email: [user.email],
      role: [user.role],
      status: [user.status],
    });
  }

  addNewUser(): void {
    if (this.newUserForm.invalid) return;

    const formValue = this.newUserForm.value;
    const tokenModel: InvitationGenTokenModel = {
      userEmail: formValue.email,
      userRole: formValue.role,
    };

    this.userService.checkUserAsync(tokenModel.userEmail).subscribe({
      next: (userExists) => {
        if (userExists) {
          this.toastService.showError('Cannot invite existing users.');
          return;
        }

        this.emailService.generateInvitationLink(tokenModel).subscribe({
          next: (res) => {
            const inviteLink = res.inviteLink;

            this.emailService.sendInvitationEmail(
              tokenModel.userEmail,
              tokenModel.userRole,
              inviteLink
            );

            this.toastService.showSuccess('Invitation sent successfully');
            this.newUserForm.reset();
          },
          error: () => {
            this.toastService.showError('Failed to generate invitation link');
          },
        });
      },
      error: (err) => {
        this.toastService.showError(err.error?.message);
      },
    });
  }

  onRowEditInit(ri: number): void {
    if (this.editingRowIndex !== null && this.editingRowIndex !== ri) {
      this.userTable.cancelRowEdit(this.userData[this.editingRowIndex]);
    }

    this.editingRowIndex = ri;
    const user = this.users.at(ri).value;
    this.clonedUsers[user.userCode] = { ...user };
  }

  onRowEditSave(ri: number): void {
    const updatedUser = this.users.at(ri).value;
    this.confirmationService
      .confirm$({
        header: 'Confirm Update',
        message: `Are you sure you want to update user "${updatedUser.email}"?`,
        actionLabel: 'Update',
      })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          const data: UserUpdateModel = {
            userCode: updatedUser.userCode,
            role: updatedUser.role,
            status: updatedUser.status,
          };

          this.userService.updateUserStatusAndRole(data).subscribe({
            next: (res) => {
              this.toastService.showSuccess(res.message);
              delete this.clonedUsers[updatedUser.userCode];
              this.editingRowIndex = null;
              this.loadUserList();
            },
            error: (err) => {
              this.toastService.showError(
                err.error?.message || 'Error occurred while updating user.'
              );
            },
          });
        }
      });

    delete this.clonedUsers[updatedUser.userCode];
    this.editingRowIndex = null;
  }

  onRowEditCancel(ri: number): void {
    const userCode = this.users.at(ri).value.userCode;
    delete this.clonedUsers[userCode];
    this.editingRowIndex = null;
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      default:
        return 'info';
    }
  }

  getUserFormGroup(index: number): FormGroup {
    return this.users.at(index) as FormGroup;
  }

  confirmLogout(event: Event): void {
    this.confirm.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to logout?',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Logout',
      rejectLabel: 'Cancel',
      acceptButtonProps: {
        severity: 'danger',
        outlined: true,
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.authService.logout();
      },
      reject: () => {},
    });
  }

  onRowDelete(ri: number): void {
    const userForm = this.users.at(ri);
    const email = userForm.value.email;

    this.confirmationService
      .confirm$({
        header: 'Confirm Deletion',
        message: `Are you sure you want to delete user "${email}"?`,
        actionLabel: 'Delete',
      })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.userService.deleteUser(email).subscribe({
            next: (res) => {
              this.toastService.showInfo(res.message);
              this.loadUserList();
            },
            error: (err) => {
              this.toastService.showError(
                err.error?.message ||
                  'An error occurred while deleting the user.'
              );
            },
          });
        }
      });
  }
}
