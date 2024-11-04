import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  error = '';
  searchControl = new FormControl('');
  statusFilter = new FormControl('all');

  constructor(
    private projectService: ProjectService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';

    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.error = 'Failed to load projects. Please try again.';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: Project['status']): string {
    const statusClasses = {
      draft: 'status-draft',
      submitted: 'status-submitted',
      under_review: 'status-review',
      evaluated: 'status-evaluated'
    };
    return statusClasses[status] || '';
  }

  canSubmitProject(): boolean {
    return this.authService.hasRole(['participant']);
  }

  canReviewProjects(): boolean {
    return this.authService.hasRole(['admin', 'organizer', 'jury']);
  }

  analyzeProject(project: Project): void {
    this.projectService.analyzeProject(project.id).subscribe({
      next: (result) => {
        console.log('AI Analysis Result:', result);
        // Handle the AI analysis result (you might want to show this in a modal or update the UI)
      },
      error: (error) => {
        console.error('Error analyzing project:', error);
        this.error = 'Failed to analyze project. Please try again.';
      }
    });
  }
}