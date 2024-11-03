import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'hackathons',
    loadChildren: () => import('./features/hackathon/hackathon.routes').then(m => m.HACKATHON_ROUTES),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/hackathons', pathMatch: 'full' }
];