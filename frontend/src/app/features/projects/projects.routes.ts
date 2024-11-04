import { Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';

import { authGuard } from '../../core/auth/auth.guard';

export const PROJECT_ROUTES: Routes = [
  {
    path: '',
    component: ProjectListComponent,
    title: 'Projects',
    canActivate: [authGuard],
    data: { roles: ['admin', 'organizer'] }
  }
  /* ,
  {
    path: 'new',
    component: ProjectFormComponent,
    title: 'Submit Project',
    canActivate: [authGuard],
    data: { roles: ['participant'] }
  },
  {
    path: ':id',
    component: ProjectDetailComponent,
    title: 'Project Details'
  },
  {
    path: ':id/edit',
    component: ProjectFormComponent,
    title: 'Edit Project',
    canActivate: [authGuard],
    data: { roles: ['participant'] }
  } */
];