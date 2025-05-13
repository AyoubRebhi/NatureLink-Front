import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Restaurant } from '../models/restaurant';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  //private apiUrl = 'http://localhost:9000/restaurants'; // Matches server.port=9000
  private apiUrl = `${environment.apiBaseUrl}/restaurants`;

  constructor(private http: HttpClient) {}


  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }


  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  createRestaurant(formData: FormData): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${this.apiUrl}/upload`, formData).pipe(
      catchError(this.handleError)
    );
  }


  updateRestaurant(id: number, formData: FormData): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }


  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }




  getImage(filename: string): string {
    return `${this.apiUrl}/image/${filename}`;
  }


  getRestaurantsOpenNow(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/open-now`).pipe(
      catchError(this.handleError)
    );
  }


  getRestaurantsOpenBetween(start: string, end: string): Observable<Restaurant[]> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<Restaurant[]>(`${this.apiUrl}/open-between`, { params }).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    if (error.status === 404) {
      errorMessage = 'Ressource non trouvée.';
    } else if (error.status === 400) {
      errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
    } else if (error.status === 500) {
      errorMessage = 'Erreur serveur. Veuillez contacter l\'administrateur.';
    }
    console.error(`Erreur HTTP ${error.status}:`, error);
    return throwError(() => new Error(errorMessage));
  }
}


export { Restaurant };