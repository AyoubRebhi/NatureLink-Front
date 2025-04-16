import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guide } from '../models/guide';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  private baseUrl = 'http://localhost:9000/api/tourguides';  // URL corrigée pour correspondre à celle du backend

  constructor(private http: HttpClient) {}

  // 🔹 Get all guides
  getAllGuides(): Observable<Guide[]> {
    return this.http.get<Guide[]>(this.baseUrl);
  }

  // 🔹 Get guide by ID
  getGuideById(id: number): Observable<Guide> {
    return this.http.get<Guide>(`${this.baseUrl}/${id}`);
  }

  // 🔹 Create a new guide
  createGuide(guide: Guide): Observable<Guide> {
    return this.http.post<Guide>(this.baseUrl, guide);
  }

  // 🔹 Update an existing guide
  updateGuide(id: number, guide: Guide): Observable<Guide> {
    return this.http.put<Guide>(`${this.baseUrl}/${id}`, guide);
  }

  // 🔹 Delete a guide
  deleteGuide(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
