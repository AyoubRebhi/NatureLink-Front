import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private apiUrl = 'http://localhost:8080/api/units';

  constructor(private http: HttpClient) {}

  // Get units by logement ID
  getByLogement(logementId: number): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/logement/${logementId}`);
  }

  // Create a new unit
  createUnit(unitData: any): Observable<any> {
    return this.http.post(this.apiUrl, unitData);
  }

  // ✅ FIXED: Get all units using the existing apiUrl
  getAllUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.apiUrl);
  }

  // Delete a unit by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
