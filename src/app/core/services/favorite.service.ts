// src/app/core/services/favorite.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = `${environment.apiBaseUrl}/favorites`;

  constructor(private http: HttpClient) { }

  // Add a favorite
  addFavorite(userId: number, logementId: number) {
    const url = `${environment.apiBaseUrl}/favorites/add/${logementId}`;
    const params = new HttpParams().set('userId', userId.toString());
  
    return this.http.post(url, null, { params });
  }
  // Remove a favorite
  removeFavorite(userId: number, logementId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${logementId}`, {
      params: new HttpParams().set('userId', userId.toString())
    });
  }

  // Get all favorites of a user
  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}`, {
      params: new HttpParams().set('userId', userId.toString())
    });
  }

  // Check if a logement is a favorite
  isFavorite(userId: number, logementId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${logementId}/is-favorite`, {
      params: new HttpParams().set('userId', userId.toString())
    });
  }
}
