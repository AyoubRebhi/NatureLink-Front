// travel.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DayActivity {
  activity: string;
  description: string;
  transport?: string;
  duration?: string;
}

export interface DayItinerary {
  day: number;
  morning: DayActivity;
  afternoon: DayActivity;
  evening: DayActivity;
  tips: string;
  restaurant_options?: Array<{
    name: string;
    description: string;
    price_range: string;
  }>;
}

export interface ItineraryRequest {
  destination: string;
  days: number;
  comfort_level: string;
  travel_style: string;
}

export interface ItineraryResponse {
  status: string;
  data: {
    destination: string;
    days: number;
    comfort_level: string;
    travel_style: string;
    itinerary: DayItinerary[];
    estimated_budget: string;
    additional_tips: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private apiUrl = 'http://localhost:5010/api';

  constructor(private http: HttpClient) { }

  generateItinerary(request: ItineraryRequest): Observable<ItineraryResponse> {
    return this.http.post<any>(`${this.apiUrl}/generate-itinerary`, request).pipe(
      map(response => {
        if (response.status === 'success') {
          // Parse the JSON string if it's returned as string
          try {
            const parsedData = typeof response.data === 'string' ? 
              JSON.parse(response.data) : 
              response.data;
            
            return {
              ...response,
              data: parsedData
            };
          } catch (e) {
            console.error('Error parsing itinerary data', e);
            return {
              status: 'error',
              message: 'Failed to parse itinerary data'
            };
          }
        }
        return response;
      })
    );
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}