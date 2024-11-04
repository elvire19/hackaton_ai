import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { TeamMember } from '../../features/projects/models/project.model';
import { TeamMember1 } from '../../features/teams/models/team.model';


export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'organizer' | 'participant' | 'mentor' | 'jury';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSubject = new BehaviorSubject<User | null>(null);
  private refreshTokenTimeout?: number;
  private apiUrl = `${environment.apiUrl}/auth/users`;

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.startRefreshTokenTimer();
    }
  }


  getUsers(): Observable<TeamMember1[]> {
    return this.http.get<TeamMember1[]>(this.apiUrl);
  };

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}${environment.auth.registerEndpoint}`,
      request
    ).pipe(
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.auth.loginEndpoint}`, {
      email,
      password
    }).pipe(
      map(response => {
        const { user, token, refreshToken } = response;
        this.storeAuthData(user, token, refreshToken);
        return user;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}${environment.auth.logoutEndpoint}`, { refreshToken })
        .subscribe({
          next: () => this.clearAuthData(),
          error: () => this.clearAuthData()
        });
    } else {
      this.clearAuthData();
    }
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}${environment.auth.refreshTokenEndpoint}`,
      { refreshToken }
    ).pipe(
      tap(response => {
        const { user, token, refreshToken } = response;
        this.storeAuthData(user, token, refreshToken);
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  private storeAuthData(user: User, token: string, refreshToken: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    this.currentUserSubject.next(user);
    this.startRefreshTokenTimer();
  }

  private clearAuthData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.stopRefreshTokenTimer();
    this.router.navigate(['/auth/login']);
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  private startRefreshTokenTimer(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const jwtToken = this.parseJwt(token);
      if (jwtToken?.exp) {
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        if (timeout > 0) {
          this.refreshTokenTimeout = window.setTimeout(() => this.refreshToken().subscribe(), timeout);
        } else {
          this.refreshToken().subscribe();
        }
      }
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      window.clearTimeout(this.refreshTokenTimeout);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 404:
          errorMessage = 'Service not found';
          break;
        case 409:
          errorMessage = 'Email already exists';
          break;
        case 500:
          errorMessage = 'Server error';
          break;
        default:
          errorMessage = error.error?.message || 'Something went wrong';
      }
    }
    
    return throwError(() => errorMessage);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  hasRole(role: User['role'] | User['role'][]): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    return currentUser.role === role;
  }
}