import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface MentoringSession {
  id: number;
  teamId: number;
  mentorId: number;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  mentor?: {
    id: number;
    name: string;
    expertise: string[];
  };
  team?: {
    id: number;
    name: string;
    members: {
      id: number;
      name: string;
      role: string;
    }[];
  };
}

export interface CreateSessionRequest {
  teamId: number;
  mentorId: number;
  scheduledAt: string;
  duration: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MentoringService {
  private apiUrl = `${environment.apiUrl}/mentoring`;

  constructor(private http: HttpClient) {}

  getUserSessions(): Observable<MentoringSession[]> {
    return this.http.get<MentoringSession[]>(`${this.apiUrl}/sessions`);
  }

  getSession(id: number): Observable<MentoringSession> {
    return this.http.get<MentoringSession>(`${this.apiUrl}/sessions/${id}`);
  }

  scheduleSession(session: CreateSessionRequest): Observable<MentoringSession> {
    return this.http.post<MentoringSession>(`${this.apiUrl}/sessions`, session);
  }

  updateSession(id: number, updates: Partial<MentoringSession>): Observable<MentoringSession> {
    return this.http.put<MentoringSession>(`${this.apiUrl}/sessions/${id}`, updates);
  }

  cancelSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${id}`);
  }

  getMentorAvailability(mentorId: number): Observable<{
    availableSlots: {
      date: string;
      slots: string[];
    }[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/mentors/${mentorId}/availability`);
  }

  getTeamMentors(teamId: number): Observable<{
    id: number;
    name: string;
    expertise: string[];
    availability: {
      startTime: string;
      endTime: string;
      days: string[];
    };
  }[]> {
    return this.http.get<any>(`${this.apiUrl}/teams/${teamId}/mentors`);
  }
}