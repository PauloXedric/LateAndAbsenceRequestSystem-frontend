import { Routes } from '@angular/router';
import {
  PrivateLayoutComponent,
  PublicLayoutComponent,
} from '@shared/components';

import {
  RequestComponent,
  SignInComponent,
  SupportingDocumentsComponent,
  InvitedRegisterComponent,
  ResetPasswordComponent,
  AccountManagementComponent,
} from '@features/components';

import { authGuard, roleGuard, tokenLinkGuard } from '@core';
import { identityTokenGuard } from '@core/guards/identity-token.guard';
import { UserRoleEnum } from '@core/enums/roles.enum';
import { RoutePathEnum } from '@core/enums/route-path.enum';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: RoutePathEnum.Request, pathMatch: 'full' },
      { path: RoutePathEnum.Request, component: RequestComponent },
      { path: RoutePathEnum.SignIn, component: SignInComponent },
      { path: RoutePathEnum.Unauthorized, component: RequestComponent },
    ],
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivateChild: [authGuard, roleGuard],
    children: [
      {
        path: RoutePathEnum.Secretary,
        data: { roles: [UserRoleEnum.Secretary] },
        loadChildren: () =>
          import('@features/components/_secretary/secretary.routes').then(
            (m) => m.default
          ),
      },
      {
        path: RoutePathEnum.Chairperson,
        data: { roles: [UserRoleEnum.Chairperson] },
        loadChildren: () =>
          import('@features/components/_chairperson/chairperson.routes').then(
            (m) => m.default
          ),
      },
      {
        path: RoutePathEnum.Director,
        data: { roles: [UserRoleEnum.Director] },
        loadChildren: () =>
          import('@features/components/_director/director.routes').then(
            (m) => m.default
          ),
      },
      {
        path: RoutePathEnum.Developer,
        data: { roles: [UserRoleEnum.Developer] },
        component: AccountManagementComponent,
      },
    ],
  },

  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: RoutePathEnum.SupportingDocuments,
        component: SupportingDocumentsComponent,
        canActivate: [tokenLinkGuard],
      },
      {
        path: RoutePathEnum.Register,
        component: InvitedRegisterComponent,
        canActivate: [tokenLinkGuard],
      },
      {
        path: RoutePathEnum.ResetPassword,
        component: ResetPasswordComponent,
        canActivate: [identityTokenGuard],
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
