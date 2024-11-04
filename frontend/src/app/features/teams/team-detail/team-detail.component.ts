import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../services/team.service';
import { Team, TeamMember1 } from '../models/team.model';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit {
  team?: Team;
  loading = true;
  error = '';
  analytics: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadTeam(+id);
  }

  loadTeam(id: number): void {
    this.loading = true;
    this.error = '';

    this.teamService.getTeam(id).subscribe({
      next: (team) => {
        this.team = team;
        this.loadTeamAnalytics(id);
      },
      error: (error) => {
        console.error('Error loading team:', error);
        this.error = 'Failed to load team details.';
        this.loading = false;
      }
    });
  }

  private loadTeamAnalytics(teamId: number): void {
    this.teamService.getTeamAnalytics(teamId).subscribe({
      next: (analytics) => {
        this.analytics = analytics;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading team analytics:', error);
        this.loading = false;
      }
    });
  }

  getMemberContribution(member: TeamMember1): number {
    if (!this.analytics?.memberContributions) return 0;
    const contribution = this.analytics.memberContributions
      .find((c: any) => c.userId === member.userId);
    return contribution?.contributions || 0;
  }

  canEditTeam(): boolean {
    if (!this.team) return false;
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) return false;

    const isTeamMember = this.team.Users.some(member => member.userId === currentUser.id);
    return isTeamMember || this.authService.hasRole(['participant' ,'admin', 'organizer']);
  }

  onDeleteTeam(): void {
    if (!this.team || !confirm('Are you sure you want to delete this team?')) return;

    this.teamService.deleteTeam(this.team.id).subscribe({
      next: () => {
        this.router.navigate(['/teams']);
      },
      error: (error) => {
        console.error('Error deleting team:', error);
        this.error = 'Failed to delete team.';
      }
    });
  }
}