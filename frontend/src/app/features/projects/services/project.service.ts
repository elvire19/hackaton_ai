import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectEvaluation } from '../models/project.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProjects(hackathonId?: number): Observable<Project[]> {
    const url = hackathonId 
      ? `${environment.apiUrl}/hackathons/${hackathonId}/projects`
      : this.apiUrl;
    return this.http.get<Project[]>(url);
  }

  getProject(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${projectId}`);
  }

  submitProject(project: {
    name: string;
    description: string;
    githubUrl: string;
    demoUrl?: string;
    technologies: string[];
    hackathonId: number;
    teamId: number;
  }): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}`, project);
  }

  updateProject(projectId: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${projectId}`, project);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  }

  getProjectEvaluations(projectId: number): Observable<ProjectEvaluation[]> {
    return this.http.get<ProjectEvaluation[]>(`${this.apiUrl}/${projectId}/evaluations`);
  }

  analyzeProject(projectId: number): Observable<{
    score: number;
    feedback: string[];
    analysis: {
      innovation: number;
      feasibility: number;
      impact: number;
      technicalComplexity: number;
    };
  }> {
    return this.http.post<any>(`${this.apiUrl}/${projectId}/analyze`, {});
  }

  submitEvaluation(projectId: number, evaluation: {
    scores: {
      innovation: number;
      impact: number;
      feasibility: number;
      presentation: number;
    };
    feedback?: string;
  }): Observable<ProjectEvaluation> {
    return this.http.post<ProjectEvaluation>(
      `${this.apiUrl}/${projectId}/evaluations`,
      evaluation
    );
  }
}