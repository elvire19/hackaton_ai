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
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.PROJECT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'teams',
    loadChildren: () => import('./features/teams/teams.routes').then(m => m.TEAM_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'mentoring',
    loadChildren: () => import('./features/mentoring/mentoring.routes').then(m => m.MENTORING_ROUTES),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/hackathons', pathMatch: 'full' }
];