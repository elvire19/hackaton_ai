import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectValidationService {
  validateProject(project: Partial<Project>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!project.name?.trim()) {
      errors.push('Project name is required');
    }

    if (!project.description?.trim()) {
      errors.push('Project description is required');
    }

    if (!project.technologies?.length) {
      errors.push('At least one technology must be specified');
    }

    if (!project.team?.users?.length) {
      errors.push('Project must have at least one team member');
    }

    // URL validations
    if (project.githubUrl && !this.isValidUrl(project.githubUrl)) {
      errors.push('Repository URL is invalid');
    }

    if (project.demoUrl && !this.isValidUrl(project.demoUrl)) {
      errors.push('Demo URL is invalid');
    }

    // Team size validation
    if (project.team?.users && project.team.users.length > 5) {
      errors.push('Team size cannot exceed 5 members');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateSubmission(project: Project): { canSubmit: boolean; reasons: string[] } {
    const reasons: string[] = [];

    if (project.status !== 'draft') {
      reasons.push('Project has already been submitted');
    }

    if (!project.githubUrl) {
      reasons.push('Repository URL is required for submission');
    }

    if (!project.description || project.description.length < 100) {
      reasons.push('Project description must be at least 100 characters');
    }

    if (!project.technologies || project.technologies.length < 2) {
      reasons.push('At least two technologies must be specified');
    }

    if (!project.team?.users || project.team.users.length < 2) {
      reasons.push('Project must have at least two team members');
    }

    return {
      canSubmit: reasons.length === 0,
      reasons
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}