import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:9000/api/menus';

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
}
