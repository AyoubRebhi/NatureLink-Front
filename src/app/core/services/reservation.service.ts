import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../../core/models/reservation.model';  // Assuming you have this model
import { TypeReservation } from '../../core/models/type-reservation.model';  // Assuming you have this model

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'http://localhost:9000/reservations';  // Base URL for the API

  constructor(private http: HttpClient) {}

  // Get all reservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}`);
  }

  // Get reservation by ID
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  // Create a new reservation
  addReservation(reservation: Reservation): Observable<any> {
    return this.http.post(this.baseUrl, reservation);
  }
  // Update an existing reservation
  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}`, reservation);
  }

  // Delete a reservation
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Get reservations by type
  getReservationsByType(typeres: TypeReservation): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/type/${typeres}`);
  }

  // Get a reservation by type and ID
  getReservationByTypeAndId(typeres: TypeReservation, id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/type/${typeres}/${id}`);
  }

  // Create a reservation by type
  addReservationByType(typeres: TypeReservation, reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/type/${typeres}`, reservation);
  }

  // Update a reservation by type and ID
  updateReservationByType(typeres: TypeReservation, id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/type/${typeres}/${id}`, reservation);
  }

  // Delete a reservation by type and ID
  deleteReservationByType(typeres: TypeReservation, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/type/${typeres}/${id}`);
  }
  getReservationsByUserId(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/user/${userId}`);
  }
  downloadReservationPDF(id: number): Observable<Blob> {
    const url = `${this.baseUrl}/api/reservations/${id}/pdf`;  // Make sure the backend path is correct
    return this.http.get(url, { responseType: 'blob' });
  }
  getUpcomingReservationsByUserId(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/user/${userId}/upcoming`);
  }
}
