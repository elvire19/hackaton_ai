import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const MENTORING_ROUTES: Routes = [
  /* {
    path: '',
    component: MentoringDashboardComponent,
    title: 'Mentoring Dashboard'
  } *//* ,
  {
    path: 'schedule',
    component: SessionSchedulerComponent,
    title: 'Schedule Session',
    canActivate: [authGuard],
    data: { roles: ['participant', 'mentor'] }
  },
  {
    path: 'sessions/:id',
    component: SessionDetailsComponent,
    title: 'Session Details'
  } */
];