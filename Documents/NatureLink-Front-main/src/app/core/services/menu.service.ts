import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private baseUrl = 'http://localhost:9000/api/menus/restaurants';


  constructor(private http: HttpClient) {}

  // CREATE
  createMenu(restaurantId: number, menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(`${this.baseUrl}/${restaurantId}/menus`, menu).pipe(
      catchError(this.handleError)
    );
  }
  getMenusByRestaurant(restaurantId: number): Observable<Menu[]> {
    console.log("Appel API pour récupérer les menus...");
    return this.http.get<Menu[]>(`${this.baseUrl}/${restaurantId}/menus`).pipe(
      catchError(this.handleError)
    );
  }

   // Récupérer un menu par son ID et l'ID du restaurant
   getMenuById(restaurantId: number, menuId: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.baseUrl}/${restaurantId}/menus/${menuId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateMenu(restaurantId: number, menuId: number, updatedMenu: Menu): Observable<Menu> {
    return this.http.put<Menu>(
      `${this.baseUrl}/${restaurantId}/menus/${menuId}`,
      updatedMenu
    );
  }


  // DELETE
  deleteMenu(restaurantId: number, menuId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${restaurantId}/menus/${menuId}`).pipe(
      catchError(this.handleError)
    );
  }

    // Gestion des erreurs
    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Une erreur inconnue est survenue';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      }
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    }
}
