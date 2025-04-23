import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logement } from '../../core/models/logement.model';

@Injectable({
  providedIn: 'root',
})
export class LogementService {
  private apiUrl = 'http://localhost:9000/logements';

  constructor(private http: HttpClient) {}

  getAllLogements(): Observable<Logement[]> {
    return this.http.get<Logement[]>(this.apiUrl);
  }

  getLogementById(id: number): Observable<Logement> {
    return this.http.get<Logement>(`${this.apiUrl}/${id}`);
  }

  addLogement(logement: Logement): Observable<Logement> {
    return this.http.post<Logement>(this.apiUrl, logement);
  }


  deleteLogement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLogementsByUser(): Observable<Logement[]> {
    const userId = 5; // Static for now
    return this.http.get<Logement[]>(`${this.apiUrl}/proprietaire/${userId}`);
  }
  updateLogementWithImage(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/upload/${id}`, formData);
  }
  updateLogement(id: number, logement: Logement): Observable<Logement> {
    return this.http.put<Logement>(`${this.apiUrl}/${id}`, logement);
  }
}


 
