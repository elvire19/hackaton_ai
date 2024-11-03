import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-content">
        <h1>{{ title }}</h1>
        <nav *ngIf="authService.isAuthenticated()">
          <a routerLink="/hackathons" routerLinkActive="active">Hackathons</a>
          <a routerLink="/projects" routerLinkActive="active">Projects</a>
          <a routerLink="/teams" routerLinkActive="active">Teams</a>
          <a routerLink="/mentoring" routerLinkActive="active">Mentoring</a>
          <a routerLink="/jury" routerLinkActive="active">Jury</a>
        </nav>
        <div class="user-menu" *ngIf="authService.currentUser$ | async as user">
          <button class="user-button">
            <i class="fas fa-user-circle"></i>
            {{ user.name }}
            <i class="fas fa-chevron-down"></i>
          </button>
          <button class="logout-button" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title = 'Hackathon AI';

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}