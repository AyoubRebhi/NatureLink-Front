// auth.service.ts
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, Role } from '../models/user.model';
import { PaymentService } from './payment.service';
import { AuthResponse } from '../models/auth-response'
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = `${environment.apiBaseUrl}`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private hasPendingPayments = new BehaviorSubject<boolean>(false);
  public hasPendingPayments$ = this.hasPendingPayments.asObservable();

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private injector: Injector
  ) {
    this.initializeAuthState();
  }
  getCurrentUser(): User | null {
    return this.currentUserSubject.value; // Or however you store the user
  }

  private initializeAuthState() {
    try {
      const token = localStorage.getItem('auth_token');
      const userJson = localStorage.getItem('current_user');

      if (token && userJson && userJson !== 'undefined') {
        const user: User = JSON.parse(userJson);
        if (this.validateUser(user)) {
          this.currentUserSubject.next(user);
          return;
        }
      }
    } catch (e) {
      console.error('Auth initialization error:', e);
    }
    this.clearAuthData();
  }

  private validateUser(user: User | null): boolean {
    if (!user) return false;
    return !isNaN(user.id) &&
      typeof user.id === 'number' &&
      !!user.email &&
      !!user.role;
  }

  signUp(userData: { username: string; email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/signup`, userData).pipe(
      tap({
        next: (response) => {
          const user = this.decodeJwt(response.token);
          this.setSession(response.token, user);
          this.redirectAfterLogin(user.role);
        },
        error: (error) => {
          console.error('Signup error:', error);
          throw error;
        }
      })
    );
  }

  signIn(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/signin`, credentials).pipe(
      mergeMap((response) => {
        const user = this.decodeJwt(response.token);
        console.log('Decoded user:', user);
        if (user.blocked) {
          return throwError(() => new Error('Account blocked. Please contact administrator.'));
        }

        this.setSession(response.token, user);
        this.redirectAfterLogin(user.role);

        // ✅ Retourner la réponse initiale pour respecter Observable<{ token: string }>
        return of(response);
      }),
      tap({
        error: (error) => {
          console.error('Login error:', error);
        }
      })
    );
  }

  // Update the decodeJwt method
  private decodeJwt(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT Payload:', payload);
      return {
        id: Number(payload.id),  // Get from dedicated id claim
        username: payload.username,
        email: payload.email,  // Email from subject
        role: this.mapRole(payload.roles?.[0]),
        blocked: payload.blocked
      };
    } catch (e) {
      console.error('JWT Decoding Error:', e, 'Token:', token);
      throw new Error('Invalid token format');
    }
  }

  private mapRole(roleString: string): Role {
    if (!roleString) return Role.USER;
    const roleMap: { [key: string]: Role } = {
      'admin': Role.ADMIN,
      'user': Role.USER,
      'employee': Role.EMPLOYEE,
      'agence': Role.AGENCE,  // Add this mapping
      'provider': Role.PROVIDER  // Add this mapping
    };
    return roleMap[roleString.toLowerCase()] || Role.USER;
  }

  private setSession(token: string, user: User) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // auth.service.ts
  private redirectAfterLogin(role: Role) {
    let targetRoute = '/';

    if (role === Role.ADMIN) {

      console.log('Redirecting admin to dashboard');
      targetRoute = '/admin';
    } else if (role === Role.AGENCE) {
      console.log('Redirecting agency to transport dashboard');
      targetRoute = '/admin/transport'; // Redirect to transport list
    } else if (role === Role.PROVIDER) {
      console.log('Redirecting agency to activity dashboard');
      targetRoute = '/admin/activity'; // Redirect to transport list
    } 
    else {
      console.log('Redirecting regular user to home');
    }

    this.router.navigateByUrl(targetRoute, { replaceUrl: true })
      .then(success => {
        if (!success) {
          console.error('Navigation to', targetRoute, 'failed');
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  public updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  updateUser(userId: number, userData: any): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/api/users/${userId}`,
      userData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(updatedUser => {
        this.updateCurrentUser(updatedUser); // Use the new method here
      })
    );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/api/users/${userId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.logout())
    );
  }

  public getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  getCurrentUserId(): number | null {
    return this.currentUserValue?.id || null;
  }
  getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('current_user', JSON.stringify(user));
  }
  // auth.service.ts
  uploadProfilePicture(userId: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);

    // Add the base API URL
    return this.http.post<User>(
      `${this.apiUrl}/api/users/${userId}/upload-profile-pic`, // Fixed URL
      formData
    ).pipe(
      tap(updatedUser => this.setCurrentUser(updatedUser))
    );
  }
  // auth.service.ts
  hasRole(role: Role): boolean {
    const user = this.currentUserValue;
    return user?.role === role;
  }

  hasAnyRole(roles: Role[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.includes(user.role) : false;
  }
}