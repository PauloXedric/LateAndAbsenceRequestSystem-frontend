import { Routes } from '@angular/router';
import { RoutePathEnum } from '@core/enums/route-path.enum';
import {
  DirectorNavigationComponent,
  DirectorRequestComponent,
  AccountManagementComponent,
} from '@features/components';
import {
  InstructorCoursesComponent,
  ApprovalHistoryComponent,
} from '@shared/components';

export default [
  {
    path: '',
    component: DirectorNavigationComponent,
    children: [
      {
        path: RoutePathEnum.DirectorRequest,
        component: DirectorRequestComponent,
      },
      {
        path: RoutePathEnum.Instructors,
        component: InstructorCoursesComponent,
      },
      {
        path: RoutePathEnum.History,
        component: ApprovalHistoryComponent,
      },
      {
        path: RoutePathEnum.AccountManagement,
        component: AccountManagementComponent,
      },
      {
        path: '',
        redirectTo: RoutePathEnum.DirectorRequest,
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
