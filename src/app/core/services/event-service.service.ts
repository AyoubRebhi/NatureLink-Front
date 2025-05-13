import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Event } from '../models/event.module'; // Adjust the import path as necessary
import { environment } from 'src/environments/environment.prod';
const BASIC_URl = `${environment.apiBaseUrl}`;
@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
  private BASIC_URl = `${environment.apiBaseUrl}`;  // Assuming your backend is running locally


  constructor(private http:HttpClient) {}

  postEvent(Event:any):Observable<any>{
    return this.http.post(BASIC_URl+"/event/add",Event);
  }

  getAllEvents():Observable<any>{
    return this.http.get(BASIC_URl+"/event/All")
  }


  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${BASIC_URl}/event/All/${id}`, event);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${BASIC_URl}/event/All/${id}`);
  }
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${BASIC_URl}/event/All/delete/${id}`);
  }

  downloadEventsPDF(): Observable<Blob> {
    return this.http.get(`${BASIC_URl}/event/export/pdf`, {
      responseType: 'blob'
    });
  }
  recommendEvents(userInput: string, events: any[]) {
    const payload = {
      user_input: userInput ||'',
      events: events || [],
      top_n: 3
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
        'Accept': 'application/json'
    });
    console.log('Payload envoyé:', JSON.stringify(payload));

    return this.http.post<any[]>(`${BASIC_URl}/event/recommend`, payload, { headers,withCredentials: true,  // If using session cookies
      responseType: 'json' });
  }
  
}