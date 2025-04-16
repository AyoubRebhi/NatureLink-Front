import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Visit } from '../models/visit';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly baseUrl = 'http://localhost:9000/api/visits';

  constructor(private http: HttpClient) {}

  /** Récupérer toutes les visites */
  getAllVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.baseUrl).pipe(
      catchError(this.handleError)  // Ajout de la gestion des erreurs
    );
  }

  /** Récupérer une visite par son ID */
  getVisitById(id: number): Observable<Visit> {
    return this.http.get<Visit>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Créer une nouvelle visite */
  createVisit(visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(this.baseUrl, visit).pipe(
      catchError(this.handleError)
    );
  }

  /** Mettre à jour une visite existante */
  updateVisit(id: number, visit: Visit): Observable<Visit> {
    return this.http.put<Visit>(`${this.baseUrl}/${id}`, visit).pipe(
      catchError(this.handleError)
    );
  }

  /** Supprimer une visite par son ID */
  deleteVisit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Gestion des erreurs */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue, veuillez réessayer plus tard.';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur côté serveur: Code ${error.status}, Message: ${error.message}`;
    }

    console.error('Erreur HTTP:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
