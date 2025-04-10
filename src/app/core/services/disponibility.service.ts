import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibility } from '../models/disponibility.model';

@Injectable({
  providedIn: 'root',
})
export class DisponibilityService {
  private apiUrl = 'http://localhost:8080/api/disponibilities'; // Ensure this URL matches your backend API

  constructor(private http: HttpClient) {}

  // Get all disponibilities
  getAllDisponibilities(): Observable<Disponibility[]> {
    return this.http.get<Disponibility[]>(this.apiUrl);
  }

  // Get disponibilities by logement ID
  getDisponibilitiesByLogement(logementId: number): Observable<Disponibility[]> {
    return this.http.get<Disponibility[]>(`${this.apiUrl}/logement/${logementId}`);
  }

  // Create a new disponibility
  createDisponibility(disponibility: Disponibility): Observable<Disponibility> {
    return this.http.post<Disponibility>(this.apiUrl + '/add/' + disponibility.logementId, disponibility);
  }

  // Update an existing disponibility
  updateDisponibility(id: number, disponibility: Disponibility): Observable<Disponibility> {
    return this.http.put<Disponibility>(`${this.apiUrl}/${id}`, disponibility);
  }

  // Delete a disponibility
  deleteDisponibility(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
