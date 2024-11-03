import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export interface AuthGuardData {
  roles?: string[];
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const guardData = route.data as AuthGuardData;
  if (guardData?.roles && guardData.roles.length > 0) {
    const hasRequiredRole = guardData.roles.some(role => 
      authService.hasRole(role as any)
    );

    if (!hasRequiredRole) {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};