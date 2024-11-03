import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Hackathon } from '../models/hackathon.model';
import { environment } from '../../../../../environments/environment';

export interface HackathonFilters {
  status?: Hackathon['status'];
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface HackathonResponse {
  data: Hackathon[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class HackathonService {
  private apiUrl = `${environment.apiUrl}/hackathons`;

  constructor(private http: HttpClient) {}

  getHackathons(filters: HackathonFilters = {}): Observable<HackathonResponse> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.status) params = params.set('status', filters.status);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.category) params = params.set('category', filters.category);

    return this.http.get<any>(this.apiUrl, { params })
      .pipe(
        map(response => {
          // Handle both array and paginated response formats
          const data = Array.isArray(response) ? response : (response.data || []);
          return {
            data,
            total: Array.isArray(response) ? data.length : (response.total || data.length),
            page: filters.page || 1,
            limit: filters.limit || 10
          };
        })
      );
  }

  getHackathon(id: number): Observable<Hackathon> {
    return this.http.get<Hackathon>(`${this.apiUrl}/${id}`);
  }

  createHackathon(hackathon: Partial<Hackathon>): Observable<Hackathon> {
    return this.http.post<Hackathon>(this.apiUrl, hackathon);
  }

  updateHackathon(id: number, hackathon: Partial<Hackathon>): Observable<Hackathon> {
    return this.http.put<Hackathon>(`${this.apiUrl}/${id}`, hackathon);
  }

  deleteHackathon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportHackathonData(id: number, format: 'csv' | 'json' = 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }
}