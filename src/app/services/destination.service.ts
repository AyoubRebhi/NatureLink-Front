import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination } from '../model/Destination.model';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = 'http://localhost:8080/api/destinations';

  constructor(private http: HttpClient) { }

  getAllDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.apiUrl);
  }

  getDestinationById(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/${id}`);
  }

  addDestination(destination: Destination): Observable<Destination> {
    return this.http.post<Destination>(this.apiUrl, destination);
  }

  deleteDestination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}