import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true;

  const raw = sessionStorage.getItem('visitor');
  if (raw) {
    const visitor = JSON.parse(raw);
    if (visitor?.is_admin) return true;
  }

  router.navigate(['/']);
  return false;
};
