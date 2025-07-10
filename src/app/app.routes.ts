import { Routes } from '@angular/router';
import {
  ApprovalHistoryComponent,
  InstructorCoursesComponent,
  PrivateLayoutComponent,
  PublicLayoutComponent,
} from '@shared/components';

import { authGuard, roleGuard, tokenLinkGuard } from '@core';
import {
  RequestComponent,
  SupportingDocumentsComponent,
  SecretaryNavigationComponent,
  SecretaryInitialRequestComponent,
  SecretarySecondaryRequestComponent,
  ChairpersonNavigationComponent,
  ChairpersonRequestComponent,
  AccountManagementComponent,
  SignInComponent,
  DirectorNavigationComponent,
  DirectorRequestComponent,
  InvitedRegisterComponent,
  ResetPasswordComponent,
} from '@features/components';
import { identityTokenGuard } from '@core/guards/identity-token.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'request', pathMatch: 'full' },
      { path: 'request', component: RequestComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'unauthorized', component: RequestComponent },
    ],
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivateChild: [authGuard, roleGuard],
    children: [
      {
        path: 'secretary',
        component: SecretaryNavigationComponent,
        data: { roles: ['Secretary'] },
        children: [
          {
            path: 'initial-request',
            component: SecretaryInitialRequestComponent,
          },
          {
            path: 'secondary-request',
            component: SecretarySecondaryRequestComponent,
          },
          { path: '', redirectTo: 'initial-request', pathMatch: 'full' },
        ],
      },
      {
        path: 'chairperson',
        component: ChairpersonNavigationComponent,
        data: { roles: ['Chairperson'] },
        children: [
          {
            path: 'chairperson-request',
            component: ChairpersonRequestComponent,
          },
          { path: 'instructors', component: InstructorCoursesComponent },
          { path: 'history', component: ApprovalHistoryComponent },
          { path: '', redirectTo: 'chairperson-request', pathMatch: 'full' },
        ],
      },
      {
        path: 'director',
        component: DirectorNavigationComponent,
        data: { roles: ['Director'] },
        children: [
          { path: 'director-request', component: DirectorRequestComponent },
          { path: 'instructors', component: InstructorCoursesComponent },
          { path: 'history', component: ApprovalHistoryComponent },
          { path: 'account-management', component: AccountManagementComponent },
          { path: '', redirectTo: 'director-request', pathMatch: 'full' },
        ],
      },
    ],
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'supporting-documents',
        component: SupportingDocumentsComponent,
        canActivate: [tokenLinkGuard],
      },
      {
        path: 'register',
        component: InvitedRegisterComponent,
        canActivate: [tokenLinkGuard],
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [identityTokenGuard],
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
