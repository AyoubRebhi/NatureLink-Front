import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Menu } from '../models/menu';
import { catchError, map } from 'rxjs/operators'; // Added 'map' importimport { catchError, map } from 'rxjs/operators'; // Added 'map' import

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:9000/api/menus';
  private recommendationApiUrl = 'http://localhost:5007/api/recommendations'; // Flask recommendation API

  constructor(private http: HttpClient) {}

  getMenusByRestaurant(restaurantId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/restaurant/${restaurantId}`)
      .pipe(catchError(this.handleError));
  }

  getMenuById(restaurantId: number, menuId: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/restaurants/${restaurantId}/menus/${menuId}`)
      .pipe(catchError(this.handleError));
  }

  createMenu(restaurantId: number, formData: FormData): Observable<Menu> {
    return this.http.post<Menu>(`${this.apiUrl}/restaurant/${restaurantId}`, formData)
      .pipe(catchError(this.handleError));
  }

  updateMenu(menuId: number, formData: FormData): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/${menuId}`, formData)
      .pipe(catchError(this.handleError));
  }

  deleteMenu(menuId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${menuId}`)
      .pipe(catchError(this.handleError));
  }

  detectAllergensWithAI(menuId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/allergens/ai/${menuId}`)
      .pipe(catchError(this.handleError));
  }

  filterMenusByAllergen(restaurantId: number, allergen: string): Observable<Menu[]> {
    return this.http.post<Menu[]>(
      `${this.apiUrl}/restaurant/${restaurantId}/filter-allergen`,
      { allergen },
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(catchError(this.handleError));
  }

  getImage(filename: string): string {
    return `${this.apiUrl}/image/${filename}`;
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
  getMenuRecommendations(restaurantId: number, query: string): Observable<Menu[]> {
    const payload = { query, restaurant_id: restaurantId };
    return this.http.post<any>(this.recommendationApiUrl, payload).pipe(
      map(response => response.recommendations as Menu[] ?? []), // Extract recommendations, default to empty array if missing
      catchError(this.handleError)
    );
  }
}
