import { Routes } from '@angular/router';
import { TeamListComponent } from './team-list/team-list.component';
import { authGuard } from '../../core/auth/auth.guard';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamFormComponent } from './team-form/team-form.component';

export const TEAM_ROUTES: Routes = [
  {
    path: '',
    component: TeamListComponent,
    title: 'Teams'
  },
  {
    path: 'create',
    loadComponent: () => import('./team-form/team-form.component')
      .then(m => m.TeamFormComponent),
    title: 'Create Team',
    canActivate: [authGuard],
    data: { roles: ['participant','mentor','organizer'] }
  },
  {
    path: ':id',
    component: TeamDetailComponent,
    title: 'Team Details'
  }
,
  {
    path: ':id/edit',
    component: TeamFormComponent,
    title: 'Edit Team',
    canActivate: [authGuard]
  } 
];