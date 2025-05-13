import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Monument } from '../models/monument';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class MonumentService {
  private apiUrl = `${environment.apiBaseUrl}/api/monuments`; // Backend API URL


  constructor(private http: HttpClient) {}


  // Create a new monument
  createMonument(formData: FormData): Observable<Monument> {
    return this.http.post<Monument>(this.apiUrl, formData);
  }


  // Get a monument by ID
  getMonumentById(id: number): Observable<Monument> {
    return this.http.get<Monument>(`${this.apiUrl}/${id}`);
  }


  // Get all monuments
  getAllMonuments(): Observable<Monument[]> {
    return this.http.get<Monument[]>(this.apiUrl);
  }


  // Update a monument
  updateMonument(id: number, formData: FormData): Observable<Monument> {
    return this.http.put<Monument>(`${this.apiUrl}/${id}`, formData);
  }


  // Delete a monument
  deleteMonument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  // Enrich monument data
  enrichMonument(name: string): Observable<Monument> {
    return this.http.get<Monument>(`${this.apiUrl}/enrich/${encodeURIComponent(name)}`);
  }


  getImage(filename: string): string {
    return `${environment.apiBaseUrl}/uploads/${filename}`;
  }




}


