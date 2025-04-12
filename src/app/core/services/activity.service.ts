import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private baseUrl = 'http://localhost:9000/activities';

  constructor(private http: HttpClient) { }

  getAllActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.baseUrl);
  }

  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.baseUrl}/${id}`);
  }

  addActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.baseUrl}/add`, activity);
  }

  updateActivity(id: number, activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.baseUrl}/${id}`, activity);
  }

  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addActivityWithImages(formData: FormData): Observable<Activity> {
    return this.http.post<Activity>(`${this.baseUrl}/add-images`, formData);
  }
  updateActivityWithImages(id: number, formData: FormData): Observable<Activity> {
    return this.http.put<Activity>(`${this.baseUrl}/update-images/${id}`, formData);
  }
  generateActivityFromPrompt(params: {
    location?: string;
    type?: string;
    difficulty?: string;
    mood?: string;
    tags?: string;
  }): Observable<string> {
    return this.http.post(`${this.baseUrl}/generate`, params, { responseType: 'text' });
  }
  generateActivityFromAI(params: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/generate`, params);
  }
  


}
