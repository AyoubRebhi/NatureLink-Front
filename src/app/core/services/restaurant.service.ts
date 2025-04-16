import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Restaurant } from '../models/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://localhost:9000/restaurants';

  constructor(private http: HttpClient) { }

  // Récupérer tous les restaurants
  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error('Error fetching restaurants:', error);
        return throwError(() => new Error('Error fetching restaurants'));
      })
    );
  }

  // Récupérer l'URL de l'image
  getImageUrl(filename: string): string {
    return `${this.apiUrl}/image/${filename}`;
  }

  // Récupérer un restaurant par son ID
  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de la récupération du restaurant par ID:', error);
        return throwError(() => new Error('Erreur lors de la récupération du restaurant'));
      })
    );
  }

  // Ajouter un restaurant
  addRestaurant(formData: FormData): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${this.apiUrl}/upload`, formData).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du restaurant:', error);
        return throwError(() => new Error('Erreur lors de l\'ajout du restaurant'));
      })
    );
  }

  // Mettre à jour un restaurant
  updateRestaurant(id: number, restaurant: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.apiUrl}/${id}`, restaurant).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de la mise à jour du restaurant:', error);
        return throwError(() => new Error('Erreur lors de la mise à jour du restaurant'));
      })
    );
  }

  // Supprimer un restaurant
  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de la suppression du restaurant:', error);
        return throwError(() => new Error('Erreur lors de la suppression du restaurant'));
      })
    );
  }
}
