import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Footprint {
  distance: number;
  transportType: string;
  carbonFootprint: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CarbonFootprintService {
  private apiUrl = 'http://localhost:9000/api/footprints';

  constructor(private http: HttpClient) {}

  saveFootprint(footprint: Footprint): Observable<any> {
    return this.http.post(this.apiUrl, footprint);
  }

  getFootprints(): Observable<Footprint[]> {
    return this.http.get<Footprint[]>(this.apiUrl);
  }
}
