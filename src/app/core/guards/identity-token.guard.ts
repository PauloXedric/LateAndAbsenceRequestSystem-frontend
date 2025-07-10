import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { IdentityTokenService } from '@core/services/identity-token.service';
import { RoutePathEnum } from '@core/enums/route-path.enum';

export const identityTokenGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const identityTokenService = inject(IdentityTokenService);
  const router = inject(Router);

  const token = route.queryParamMap.get('token');
  const email = route.queryParamMap.get('email');
  identityTokenService.trySetTokenAndEmail(token, email);

  return identityTokenService.hasValidToken()
    ? true
    : router.parseUrl(RoutePathEnum.Request);
};
