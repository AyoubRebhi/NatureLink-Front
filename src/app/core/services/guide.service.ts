// guide.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guide } from '../models/guide';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/tourguides`; // Correction de l'URL

  constructor(private http: HttpClient) {}

  getAllGuides(): Observable<Guide[]> {
    return this.http.get<Guide[]>(this.baseUrl);
  }

  getGuideById(id: number): Observable<Guide> {
    return this.http.get<Guide>(`${this.baseUrl}/${id}`);
  }

  createGuide(guide: Guide): Observable<Guide> {
    return this.http.post<Guide>(this.baseUrl, guide);
  }

  updateGuide(id: number, guide: Guide): Observable<Guide> {
    return this.http.put<Guide>(`${this.baseUrl}/${id}`, guide);
  }

  deleteGuide(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
