import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransportRating } from '../models/transport-rating.model';

@Injectable({
  providedIn: 'root'
})
export class TransportRatingService {

  private baseUrl = 'http://localhost:9000/ratings';

  constructor(private http: HttpClient) {}

  // ➕ Add new rating
  addRating(rating: TransportRating): Observable<TransportRating> {
    return this.http.post<TransportRating>(`${this.baseUrl}/add`, rating);
  }

  // 📋 Get all ratings
  getAllRatings(): Observable<TransportRating[]> {
    return this.http.get<TransportRating[]>(this.baseUrl);
  }

  // 🔍 Get rating by ID
  getRatingById(id: number): Observable<TransportRating> {
    return this.http.get<TransportRating>(`${this.baseUrl}/${id}`);
  }

  getRatingsByTransportId(transportId: number): Observable<TransportRating[]> {
    return this.http.get<TransportRating[]>(`${this.baseUrl}/transport/${transportId}`);
  }
  

  // ⭐ Get average rating for a transport
  getAverageRating(transportId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/avg/${transportId}`);
  }

  // ❌ Delete a rating
  deleteRating(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
