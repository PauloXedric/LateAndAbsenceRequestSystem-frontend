import { Routes } from '@angular/router';
import { RoutePathEnum } from '@core/enums/route-path.enum';
import {
  ChairpersonNavigationComponent,
  ChairpersonRequestComponent,
} from '@features/components';
import {
  ApprovalHistoryComponent,
  InstructorCoursesComponent,
} from '@shared/components';

export default [
  {
    path: '',
    component: ChairpersonNavigationComponent,
    children: [
      {
        path: RoutePathEnum.ChairpersonRequest,
        component: ChairpersonRequestComponent,
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
        path: '',
        redirectTo: RoutePathEnum.ChairpersonRequest,
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
