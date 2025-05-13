  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Activity } from '../models/activity.model';
  import { environment } from 'src/environments/environment.prod';

  interface RecommendationRequest {
    mood_input: string;
    activities: Activity[];
  }

  interface RecommendationResponse {
    recommendations: Activity[];
    status: string;
    model?: string;
    error?: string;
  }

  @Injectable({
    providedIn: 'root'
  })
  export class ActivityService {
    private baseUrl = '${environment.apiBaseUrl}/activities';

    constructor(private http: HttpClient) {}

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

    generateImageSearchPrompt(description: string): Observable<{ query: string }> {
      return this.http.post<{ query: string }>(
        `${this.baseUrl}/generate-image-query`,
        { description }
      );
    }

    getActivityImages(description: string): Observable<{ images: string[] }> {
      return this.http.post<{ images: string[] }>(
        `${this.baseUrl}/get-activity-images`,
        { description }
      );
    }

    generateImageSearchQuery(description: string): Observable<{ query: string }> {
      return this.http.post<{ query: string }>(
        `${this.baseUrl}/generate-image-query`,
        { description }
      );
    }

    recommendActivitiesWithData(moodInput: string, activities: any[]): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/recommend`, {
        mood_input: moodInput,
        activities: activities
      });
    }

    recommendActivities(moodInput: string, activities: Activity[]): Observable<RecommendationResponse> {
      if (!moodInput || !activities || activities.length === 0) {
        throw new Error('Mood input and activities list are required');
      }
    
      // Prepare the request payload
      const requestPayload: RecommendationRequest = {
        mood_input: moodInput,
        activities: activities.map((activity: Activity) => {
          // Normalize requiredEquipment
          let requiredEquipment: string[] = [];
          if (typeof activity.requiredEquipment === 'string') {
            requiredEquipment = (activity.requiredEquipment as string)
              .split(',')
              .map((item: string) => item.trim())
              .filter((item: string) => item);
          } else if (Array.isArray(activity.requiredEquipment)) {
            requiredEquipment = activity.requiredEquipment as string[];
          } else if (activity.requiredEquipment == null) {
            requiredEquipment = [];
          }
    
          return {
            ...activity,
            mood: Array.isArray(activity.mood) ? activity.mood : [],
            tags: Array.isArray(activity.tags) ? activity.tags : [],
            imageUrls: Array.isArray(activity.imageUrls) ? activity.imageUrls : [],
            requiredEquipment
          };
        })
      };
    
      // Log payload for debugging
      console.log('Sending payload to Spring Boot:', JSON.stringify(requestPayload, null, 2));
    
      return this.http.post<RecommendationResponse>(
        `${this.baseUrl}/recommend`,
        requestPayload
      );
    }
    recommendFromAllActivities(moodInput: string): Observable<Activity[]> {
      return new Observable(observer => {
        this.getAllActivities().subscribe({
          next: (activities) => {
            this.recommendActivities(moodInput, activities).subscribe({
              next: (response) => {
                if (response.status === 'success') {
                  observer.next(response.recommendations);
                } else {
                  observer.error(response.error || 'Unknown error');
                }
              },
              error: (err) => observer.error(err)
            });
          },
          error: (err) => observer.error(err)
        });
      });
    }
  }

  export { Activity };