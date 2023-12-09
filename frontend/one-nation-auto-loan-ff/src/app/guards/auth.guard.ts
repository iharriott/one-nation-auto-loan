import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dataService = inject(DataService);
  const token = authService.getToken();
  if (token !== null) return true;
  else {
    const message = 'Please login';
    dataService.showError(message);
    router.navigate(['login']);
    return false;
  }
};
