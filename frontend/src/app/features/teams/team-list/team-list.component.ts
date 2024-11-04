import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { TeamService } from '../services/team.service';
import { Team } from '../models/team.model';
import { AuthService } from '../../../core/auth/auth.service';
import { HackathonService } from '../../hackathon/services/hackathon.service';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  hackathons: any[] = [];
  loading = true;
  error = '';
  searchControl = new FormControl('');
  hackathonFilter = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private teamService: TeamService,
    private hackathonService: HackathonService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setupFilters();
    this.loadHackathons();
    this.loadTeams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilters(): void {
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.loadTeams());

    this.hackathonFilter.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadTeams());
  }

  private loadHackathons(): void {
    this.hackathonService.getHackathons().subscribe({
      next: (response) => {
        this.hackathons = response.data;
      },
      error: (error) => {
        console.error('Error loading hackathons:', error);
      }
    });
  }

  loadTeams(): void {
    this.loading = true;
    this.error = '';

    const hackathonId = this.hackathonFilter.value;
    this.teamService.getTeams(hackathonId ? +hackathonId : undefined).subscribe({
      next: (teams) => {
        this.teams = teams.map(team => ({
          ...team,
          members: team.Users || [],
          mentors: team.Mentors || []
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.error = 'Failed to load teams. Please try again.';
        this.loading = false;
      }
    });
  }

  canCreateTeam(): boolean {
    return this.authService.hasRole(['participant','mentor','organizer']);
  }
}