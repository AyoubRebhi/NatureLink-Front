import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transport } from '../../core/models/transport.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  //private baseUrl = 'http://localhost:9000/transport';
  private baseUrl = `${environment.apiBaseUrl}/transport`;  // Base URL for the API
  constructor(private http: HttpClient) {}

  getAllTransports(): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.baseUrl}`);
  }

  getTransportById(id: number): Observable<Transport> {
    return this.http.get<Transport>(`${this.baseUrl}/${id}`);
  }

  addTransport(transport: Transport): Observable<Transport> {
    return this.http.post<Transport>(`${this.baseUrl}/add`, transport);
  }

  updateTransport(id: number, transport: Transport): Observable<Transport> {
    return this.http.put<Transport>(`${this.baseUrl}/${id}`, transport);
  }

  deleteTransport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  addTransportWithImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-image`, formData);
  }
  
  updateTransportWithImage(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-image/${id}`, formData);
  }
  
}

export { Transport };
