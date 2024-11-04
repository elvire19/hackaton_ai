import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Mentor, Team } from '../../teams/models/team.model';


export interface CreateMentorRequest {
  userId: number;
  expertise: string[];
  availability: {
    startTime: string;
    endTime: string;
    days: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class MentorService {
  private apiUrl = `${environment.apiUrl}/mentors`;

  constructor(private http: HttpClient) {}

  getAllMentors(): Observable<Mentor[]> {
    return this.http.get<Mentor[]>(this.apiUrl);
  }

  getMentor(id: number): Observable<Mentor> {
    return this.http.get<Mentor>(`${this.apiUrl}/${id}`);
  }

  createMentor(mentor: CreateMentorRequest): Observable<Mentor> {
    return this.http.post<Mentor>(this.apiUrl, mentor);
  }

  getAvailableMentors(hackathonId?: number): Observable<Mentor[]> {
    let url = `${this.apiUrl}/available`;
    if (hackathonId) {
      url += `?hackathonId=${hackathonId}`;
    }
    return this.http.get<Mentor[]>(url);
  }

  searchMentors(query: string): Observable<Mentor[]> {
    return this.http.get<Mentor[]>(`${this.apiUrl}/search`, {
      params: { query }
    });
  }

  assignMentorToTeam(mentorId: number, teamId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/${mentorId}/teams/${teamId}`,
      {}
    );
  }

  getMentorTeams(mentorId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/${mentorId}/teams`);
  }


  updateMentorExpertise(mentorId: number, expertise: string[]): Observable<Mentor> {
    return this.http.patch<Mentor>(`${this.apiUrl}/${mentorId}/expertise`, { expertise });
  }

  removeMentorFromTeam(mentorId: number, teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${mentorId}/teams/${teamId}`);
  }
}