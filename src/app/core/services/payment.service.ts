// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Payment } from '../models/payment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:9000/api/payments'; // Update with your API URL
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  public hasPendingPayments$ = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    // Replace loadInitialPayments() with auth state subscription
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadInitialPayments();
      } else {
        this.paymentsSubject.next([]);
      }
    });
  }

  private get headers(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  private loadInitialPayments(): void {
    this.getPayments().subscribe({
      next: (payments) => this.paymentsSubject.next(payments),
      error: (err) => console.error('Failed to load payments:', err)
    });
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching payments:', error);
        return throwError(() => new Error('Failed to fetch payments'));
      })
    );
  }

  createPayment(paymentData: Omit<Payment, 'id' | 'paymentDate' | 'status' | 'userId'>): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, paymentData, { headers: this.headers }).pipe(
      tap((newPayment) => {
        this.paymentsSubject.next([...this.paymentsSubject.value, newPayment]);
      }),
      catchError((error) => {
        console.error('Error creating payment:', error);
        return throwError(() => new Error('Failed to create payment'));
      })
    );
  }

  getPendingPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/pending`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching pending payments:', error);
        return throwError(() => new Error('Failed to fetch pending payments'));
      })
    );
  }

  updatePaymentStatus(id: number, status: Payment['status']): Observable<Payment> {
    return this.http.patch<Payment>(
      `${this.apiUrl}/${id}/status`,
      { status },
      { headers: this.headers }
    ).pipe(
      tap(updatedPayment => {
        const payments = this.paymentsSubject.value.map(p => 
          p.id === id ? updatedPayment : p
        );
        this.paymentsSubject.next(payments);
      }),
      catchError((error) => {
        console.error('Error updating payment status:', error);
        return throwError(() => new Error('Failed to update payment status'));
      })
    );
  }

  // Add to your Payment interface (if not already present)
  // export interface Payment {
  //   id: number;
  //   amount: number;
  //   paymentMethod: string;
  //   paymentDate: Date;
  //   status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  //   userId: number;
  // }
  checkPendingPayments(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) return;
    
    this.getPendingPayments().subscribe({
      next: (payments) => this.hasPendingPayments$.next(payments.length > 0),
      error: (err) => console.error('Error checking payments:', err)
    });
  }
}