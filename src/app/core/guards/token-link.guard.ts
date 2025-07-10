import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { RoutePathEnum } from '@core/enums/route-path.enum';

export const tokenLinkGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const token = route.queryParams['token'];
  return token ? true : inject(Router).parseUrl(RoutePathEnum.Request);
};
