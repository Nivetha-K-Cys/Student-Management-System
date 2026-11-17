
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string|undefined;

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/']);
  }
const userRole = auth.getRole();

  // Only Admin and Staff can access shared pages
  if (!requiredRole) {
    if (userRole === 'Admin' || userRole === 'Staff') {
      return true;
    }

    return router.createUrlTree(['/']);
  }

  // Role-based access
  if (userRole !== requiredRole) {
    if (userRole === 'Staff') {
      return router.createUrlTree(['/staff']);
    }

    if (userRole === 'Admin') {
      return router.createUrlTree(['/admin']);
    }

    return router.createUrlTree(['/']);
  }

  return true;
};
