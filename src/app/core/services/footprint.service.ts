// footprint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Footprint {
  id: number;
  distance: number;
  transportType: string;
  carbonFootprint: number;
  departurePoint: string;
  arrivalPoint: string;
  date: Date;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarbonFootprintService {
  private apiUrl = `${environment.apiBaseUrl}/api/footprints`;

  constructor(private http: HttpClient) {}

  saveFootprint(data: {
    distance: number;
    transportType: string;
    carbonFootprint: number;
    departurePoint: string;
    arrivalPoint: string;
    user: { id: number };

  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getFootprintsByUser(userId: number): Observable<Footprint[]> {
    return this.http.get<Footprint[]>(`${this.apiUrl}/by-user/${userId}`);
  }

  getFootprintsByTransport(transportType: string): Observable<Footprint[]> {
    return this.http.get<Footprint[]>(`${this.apiUrl}/by-transport?transportType=${transportType}`);
  }

  getFootprintsByUserAndTransport(userId: number, transportType: string): Observable<Footprint[]> {
    return this.http.get<Footprint[]>(`${this.apiUrl}/history?userId=${userId}&transportType=${transportType}`);
  }
}