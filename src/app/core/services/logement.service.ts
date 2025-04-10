import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logement } from 'src/app/core/models/logement.model';  

@Injectable({
  providedIn: 'root',
})
export class LogementService {
  private apiUrl = 'http://localhost:8080/api/logements'; 

  constructor(private http: HttpClient) {}

  getAllLogements(): Observable<Logement[]> {
    return this.http.get<Logement[]>(this.apiUrl);
  }
  addLogement(logementData: any): Observable<Logement> {
    return this.http.post<Logement>(this.apiUrl, logementData);
  }
  getLogementById(id: number): Observable<Logement> {
    return this.http.get<Logement>(`${this.apiUrl}/${id}`);
  }
  
}
