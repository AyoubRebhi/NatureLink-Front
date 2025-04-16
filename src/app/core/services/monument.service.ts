import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Monument } from '../models/monument';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonumentService {

  private apiUrl = 'http://localhost:9000/api/monuments'; // Assure-toi que ton backend tourne bien ici

  constructor(private http: HttpClient) {}

  // GET all monuments
  getAllMonuments(): Observable<Monument[]> {
    return this.http.get<Monument[]>(this.apiUrl);
  }

  // GET monument by ID
  getMonumentById(id: number): Observable<Monument> {
    return this.http.get<Monument>(`${this.apiUrl}/${id}`);
  }

  // POST: create new monument
  createMonument(monument: Monument): Observable<Monument> {
    return this.http.post<Monument>(this.apiUrl, monument);
  }

  // PUT: update monument
  updateMonument(id: number, monument: Monument): Observable<Monument> {
    return this.http.put<Monument>(`${this.apiUrl}/${id}`, monument);
  }

  // DELETE monument by ID
  deleteMonument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
