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
}
