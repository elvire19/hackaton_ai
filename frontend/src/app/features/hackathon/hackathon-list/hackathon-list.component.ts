import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HackathonService, HackathonFilters } from '../services/hackathon.service';
import { Hackathon } from '../models/hackathon.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-hackathon-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './hackathon-list.component.html',
  styleUrls: ['./hackathon-list.component.scss']
})
export class HackathonListComponent implements OnInit, OnDestroy {
  hackathons: Hackathon[] = [];
  loading = false;
  error = '';
  totalHackathons = 0;
  currentPage = 1;
  pageSize = 9;

  searchControl = new FormControl('');
  statusFilter = new FormControl('all');
  private destroy$ = new Subject<void>();

  statuses: { value: string; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  constructor(
    private hackathonService: HackathonService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setupFilters();
    this.loadHackathons();
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
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadHackathons();
    });

    this.statusFilter.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadHackathons();
    });
  }

  canCreateHackathon(): boolean {
    return this.authService.hasRole('admin') || this.authService.hasRole('organizer');
  }

  loadHackathons(): void {
    this.loading = true;
    this.error = '';

    const filters: HackathonFilters = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchControl.value || undefined,
      status: this.statusFilter.value === 'all' ? undefined : this.statusFilter.value as Hackathon['status']
    };

    this.hackathonService.getHackathons(filters).subscribe({
      next: (response) => {
        this.hackathons = response.data;
        this.totalHackathons = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hackathons:', error);
        this.error = 'Failed to load hackathons. Please try again later.';
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadHackathons();
  }

  get totalPages(): number {
    return Math.ceil(this.totalHackathons / this.pageSize);
  }

  getStatusClass(status: Hackathon['status']): string {
    const statusClasses = {
      draft: 'status-draft',
      active: 'status-active',
      completed: 'status-completed'
    };
    return statusClasses[status] || '';
  }

  exportHackathonData(hackathon: Hackathon): void {
    this.hackathonService.exportHackathonData(hackathon.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${hackathon.name.toLowerCase().replace(/\s+/g, '-')}-data.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting hackathon data:', error);
        this.error = 'Failed to export hackathon data. Please try again later.';
      }
    });
  }
}