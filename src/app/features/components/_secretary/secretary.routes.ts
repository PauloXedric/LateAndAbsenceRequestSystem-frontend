import { Route } from '@angular/router';
import { RoutePathEnum } from '@core/enums/route-path.enum';
import {
  SecretaryInitialRequestComponent,
  SecretaryNavigationComponent,
  SecretarySecondaryRequestComponent,
} from '@features/components';

export default [
  {
    path: '',
    component: SecretaryNavigationComponent,
    children: [
      {
        path: RoutePathEnum.SecretaryInitialRequest,
        component: SecretaryInitialRequestComponent,
      },
      {
        path: RoutePathEnum.SecretarySecondaryRequest,
        component: SecretarySecondaryRequestComponent,
      },
      {
        path: '',
        redirectTo: RoutePathEnum.SecretaryInitialRequest,
        pathMatch: 'full',
      },
    ],
  },
] as Route[];
