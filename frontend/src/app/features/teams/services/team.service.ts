import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team, MentoringSession, Mentor } from '../models/team.model';
import { environment } from '../../../../../environments/environment';




export interface CreateTeamRequest {
  name: string;
  description: string;
  hackathonId: number;
  memberIds: number[];
  mentorIds?: number[]; 
}

export interface AddTeamMemberRequest {
  userId: number;
  role?: 'member' | 'leader';
}

@Injectable({
  providedIn: 'root'
})



export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  getTeams(hackathonId?: number): Observable<Team[]> {
    const url = hackathonId 
      ? `${environment.apiUrl}/hackathons/${hackathonId}/teams`
      : this.apiUrl;
    return this.http.get<Team[]>(url);
  }

  getTeam(teamId: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${teamId}`);
  }

  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, {
      name: team.name,
      description: team.description,
      hackathonId: team.hackathonId,
      memberIds: team.memberIds,
      mentorIds: team.mentorIds 
 
    });
  }

  addTeamMember(teamId: number, member: AddTeamMemberRequest): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/members`, member);
  }




  updateTeam(id: number, team: CreateTeamRequest): Observable<Team> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Team>(`${this.apiUrl}/${id}`, team, { headers });
  }
  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}`);
  }

  // Team Members
  addMember(teamId: number, userId: number): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/members`, { userId });
  }

  removeMember(teamId: number, userId: number): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/members/${userId}`);
  }

  // Mentors
  assignMentor(teamId: number, mentorId: number): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/mentors`, { mentorId });
  }

  removeMentor(teamId: number, mentorId: number): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/mentors/${mentorId}`);
  }

  // Mentoring Sessions
  scheduleMentoringSession(teamId: number, session: Partial<MentoringSession>): Observable<MentoringSession> {
    return this.http.post<MentoringSession>(
      `${this.apiUrl}/${teamId}/mentoring-sessions`,
      session
    );
  }

  updateMentoringSession(teamId: number, sessionId: number, updates: Partial<MentoringSession>): Observable<MentoringSession> {
    return this.http.put<MentoringSession>(
      `${this.apiUrl}/${teamId}/mentoring-sessions/${sessionId}`,
      updates
    );
  }

  getMentoringSessions(teamId: number): Observable<MentoringSession[]> {
    return this.http.get<MentoringSession[]>(`${this.apiUrl}/${teamId}/mentoring-sessions`);
  }

  // Team Analytics
  getTeamAnalytics(teamId: number): Observable<{
    memberContributions: { userId: number; contributions: number }[];
    mentoringMetrics: { totalSessions: number; completionRate: number };
    projectProgress: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}/${teamId}/analytics`);
  }
}


