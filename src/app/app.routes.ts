import { Routes } from '@angular/router';
import { RequestComponent } from './components/request/request.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { roleGuard } from './_guards/role.guard';
import { authGuard } from './_guards/auth.guard';
import { SecretaryNavigationComponent } from './components/secretary/secretary-navigation/secretary-navigation.component';
import { PublicLayoutComponent } from './components/_layouts/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './components/_layouts/private-layout/private-layout.component';
import { SecretaryInitialRequestComponent } from './components/secretary/request/secretary-initial-request/secretary-initial-request.component';
import { SecretarySecondaryRequestComponent } from './components/secretary/request/secretary-secondary-request/secretary-secondary-request.component';
import { ChairpersonRequestComponent } from './components/chairperson/chairperson-request/chairperson-request.component';
import { InstructorCoursesComponent } from './components/instructor-courses/instructor-courses.component';
import { ApprovalHistoryComponent } from './components/approval-history/approval-history.component';
import { DirectorRequestComponent } from './components/director/director-request/director-request.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { DirectorNavigationComponent } from './components/director/layout/director-navigation/director-navigation.component';
import { ChairpersonNavigationComponent } from './components/chairperson/layout/chairperson-navigation/chairperson-navigation.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'request', pathMatch: 'full' },
      { path: 'request', component: RequestComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'unathorized', component: RequestComponent },
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
        data: { roles: ['chairperson'] },
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
  { path: '**', redirectTo: '' },
];
