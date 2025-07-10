import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@core';
import { RoutePathEnum } from '@core/enums/route-path.enum';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  let currentRoute: ActivatedRouteSnapshot | null = route;
  let expectedRoles: string[] | undefined = undefined;

  while (currentRoute) {
    expectedRoles = currentRoute.data['roles'] as string[] | undefined;
    if (expectedRoles) break;
    currentRoute = currentRoute.parent;
  }

  if (
    !expectedRoles ||
    !auth.isAuthenticated() ||
    !auth.hasRole(expectedRoles)
  ) {
    router.navigate([RoutePathEnum.Unauthorized]);
    return false;
  }

  return true;
};
