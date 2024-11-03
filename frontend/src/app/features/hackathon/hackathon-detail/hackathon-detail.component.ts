import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HackathonService } from '../services/hackathon.service';
import { Hackathon } from '../models/hackathon.model';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-hackathon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hackathon-detail.component.html',
  styleUrls: ['./hackathon-detail.component.scss']
})
export class HackathonDetailComponent implements OnInit {
  hackathon?: Hackathon;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hackathonService: HackathonService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadHackathon(+id);
  }

  // Changed from private to public to allow access from template
  loadHackathon(id: number): void {
    if (!id) {
      this.error = 'Invalid hackathon ID';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = '';

    this.hackathonService.getHackathon(id).subscribe({
      next: (hackathon) => {
        this.hackathon = hackathon;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hackathon:', error);
        this.error = 'Failed to load hackathon details.';
        this.loading = false;
      }
    });
  }

  canEdit(): boolean {
    return this.authService.hasRole(['admin', 'organizer']);
  }

  exportData(): void {
    if (!this.hackathon) return;

    this.hackathonService.exportHackathonData(this.hackathon.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.hackathon?.name.toLowerCase().replace(/\s+/g, '-')}-data.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting data:', error);
        this.error = 'Failed to export hackathon data.';
      }
    });
  }
}