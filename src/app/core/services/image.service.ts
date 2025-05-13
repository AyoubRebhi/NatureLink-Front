// src/app/services/image.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiBaseUrl}/api/images`; // à adapter si besoin

  constructor(private http: HttpClient) {}

  analyze(file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string }>(`${this.apiUrl}/analyze`, formData);
  }
}
