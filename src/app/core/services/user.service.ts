import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { PendingUser } from '../models/pending-user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:9000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}/users/admin/all`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
  

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error.message || 'Failed to load users';
    return throwError(() => new Error(errorMessage));
  }
  // user.service.ts
blockUser(userId: number): Observable<User> {
  return this.http.put<User>(
    `${this.apiUrl}/users/${userId}/block`,
    {},
    { headers: this.getAuthHeaders() }
  );
}

unblockUser(userId: number): Observable<User> {
  return this.http.put<User>(
    `${this.apiUrl}/users/${userId}/unblock`,
    {},
    { headers: this.getAuthHeaders() }
  );
}
}