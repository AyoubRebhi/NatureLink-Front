import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_BASE_URL = 'http://localhost:9000/api'; // Port 9000
  private profileUrl = `${this.API_BASE_URL}/profile`;

  constructor(private http: HttpClient) {}

  getSuggestions(text: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.profileUrl}/suggestions`, { text });
  }
}