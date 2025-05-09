import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
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

  getPendingUsers(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(
      `${this.apiUrl}/users/admin/pending-users`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Pending users failed to load:', err.message);
        return of([]); // Use RxJS 'of' to return an Observable
      })
    );
  }
  
  
  

  blockUser(userId: number): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/users/${userId}/block`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  unblockUser(userId: number): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/users/${userId}/unblock`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  approveUser(pendingUserId: number): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/users/admin/approve/${pendingUserId}`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  rejectUser(pendingUserId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/users/admin/reject/${pendingUserId}`,
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
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.message || 'Failed to complete the request';
    }
    return throwError(() => new Error(errorMessage));
  }
}