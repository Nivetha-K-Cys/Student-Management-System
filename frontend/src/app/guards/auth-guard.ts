
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/']);
  }

  if (auth.getRole() !== requiredRole) {
    return router.createUrlTree(['/']);
  }

  return true;
};
