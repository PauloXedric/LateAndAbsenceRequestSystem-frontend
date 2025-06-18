import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenLinkService } from '@core';

export const tokenLinkGuard: CanActivateFn = () => {
  const service = inject(TokenLinkService);
  const router = inject(Router);

  if (!service.isTokenExpired()) {
    return true;
  }

  router.navigate(['/request']);
  return false;
};
