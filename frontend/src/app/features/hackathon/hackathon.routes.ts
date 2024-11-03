import { Routes } from '@angular/router';
import { HackathonListComponent } from './hackathon-list/hackathon-list.component';
import { authGuard } from '../../core/auth/auth.guard';
import { HackathonDetailComponent } from './hackathon-detail/hackathon-detail.component';

export const HACKATHON_ROUTES: Routes = [
  { 
    path: '', 
    component: HackathonListComponent,
    title: 'Hackathons'
  },
  {
    path: 'create',
    loadComponent: () => import('./hackathon-form/hackathon-form.component')
      .then(m => m.HackathonFormComponent),
    title: 'Create Hackathon',
    canActivate: [authGuard],
    data: { roles: ['admin', 'organizer'] }
  },
  
  {
    path: ':id',
    component: HackathonDetailComponent,
    title: 'Hackathon Details'
  }
   /*
  {
    path: ':id/edit',
    loadComponent: () => import('./hackathon-form/hackathon-form.component')
      .then(m => m.HackathonFormComponent),
    title: 'Edit Hackathon',
    canActivate: [authGuard],
    data: { roles: ['admin', 'organizer'] }
  },
  {
    path: ':id/projects',
    loadComponent: () => import('./hackathon-projects/hackathon-projects.component')
      .then(m => m.HackathonProjectsComponent),
    title: 'Hackathon Projects'
  },
  {
    path: ':id/teams',
    loadComponent: () => import('./hackathon-teams/hackathon-teams.component')
      .then(m => m.HackathonTeamsComponent),
    title: 'Hackathon Teams'
  },
  {
    path: ':id/mentoring',
    loadComponent: () => import('./hackathon-mentoring/hackathon-mentoring.component')
      .then(m => m.HackathonMentoringComponent),
    title: 'Hackathon Mentoring'
  },
  {
    path: ':id/jury',
    loadComponent: () => import('./hackathon-jury/hackathon-jury.component')
      .then(m => m.HackathonJuryComponent),
    title: 'Hackathon Jury',
    canActivate: [authGuard],
    data: { roles: ['admin', 'organizer', 'jury'] }
  }*/
]; 