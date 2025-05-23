// visit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visit } from '../models/visit';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly baseUrl = 'http://localhost:9000/api/visits';

  constructor(private http: HttpClient) {}

  getAllVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.baseUrl);
  }

  getVisitById(id: number): Observable<Visit> {
    return this.http.get<Visit>(`${this.baseUrl}/${id}`);
  }

  createVisit(visit: Partial<Visit>): Observable<Visit> {
    return this.http.post<Visit>(this.baseUrl, visit);
  }

  updateVisit(id: number, visit: Partial<Visit>): Observable<Visit> {
    return this.http.put<Visit>(`${this.baseUrl}/${id}`, visit);
  }

  deleteVisit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getVisitsByMonumentId(monumentId: number): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.baseUrl}/monument/${monumentId}/with-relations`);
  }
}
