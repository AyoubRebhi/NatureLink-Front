import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const BASIC_URl=["http://localhost:8081"]

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

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
    return this.http.get<Event>(`${BASIC_URl}/All/${id}`);
  }
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${BASIC_URl}/event/All/delete/${id}`);
  }
  
}
