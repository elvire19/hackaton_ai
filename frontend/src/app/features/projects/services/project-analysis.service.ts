import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from '../../../../../environments/environment';

export interface ProjectAnalysis {
  score: number;
  feedback: string[];
  analysis: {
    innovation: number;
    feasibility: number;
    impact: number;
    technicalComplexity: number;
    marketPotential: number;
  };
  recommendations: string[];
  similarProjects: {
    id: number;
    name: string;
    similarity: number;
    technologies: string[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectAnalysisService {
  private apiUrl = `${environment.apiUrl}/analysis`;

  constructor(private http: HttpClient) {}

  analyzeProjectDescription(description: string): Observable<{
    categories: string[];
    keywords: string[];
    suggestedTechnologies: string[];
    complexity: 'low' | 'medium' | 'high';
  }> {
    return this.http.post<any>(`${this.apiUrl}/description`, { description });
  }

  analyzeTechnicalFeasibility(project: Project): Observable<{
    feasibilityScore: number;
    risks: string[];
    suggestions: string[];
    timeEstimate: {
      min: number;
      max: number;
      unit: 'days' | 'weeks';
    };
  }> {
    return this.http.post<any>(`${this.apiUrl}/feasibility`, project);
  }

  analyzeMarketPotential(project: Project): Observable<{
    marketScore: number;
    targetAudience: string[];
    competitors: string[];
    opportunities: string[];
    challenges: string[];
  }> {
    return this.http.post<any>(`${this.apiUrl}/market`, project);
  }

  predictSuccessRate(project: Project): Observable<{
    successProbability: number;
    keyFactors: {
      factor: string;
      impact: number;
      suggestion?: string;
    }[];
  }> {
    return this.http.post<any>(`${this.apiUrl}/success-prediction`, project);
  }

  getSimilarProjects(project: Project): Observable<{
    projects: {
      id: number;
      name: string;
      similarity: number;
      technologies: string[];
      successFactors: string[];
    }[];
  }> {
    return this.http.post<any>(`${this.apiUrl}/similar-projects`, project);
  }

  getTeamCompatibilityAnalysis(project: Project): Observable<{
    compatibilityScore: number;
    skillsCoverage: {
      covered: string[];
      missing: string[];
    };
    recommendations: string[];
  }> {
    return this.http.post<any>(`${this.apiUrl}/team-compatibility`, project);
  }
}