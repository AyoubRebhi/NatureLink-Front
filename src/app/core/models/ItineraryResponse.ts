export interface ItineraryResponse {
    status?: string;
    message?: string;
    destination: string;
    days: number;
    comfort_level: string;
    travel_style: string;
    itinerary: {
        day: number;
        morning: {
            activity: string;
            description: string;
            restaurant_suggestion?: string;
        };
        afternoon: {
            activity: string;
            description: string;
            restaurant_suggestion?: string;
            notes?: string;
        };
        evening: {
            activity: string;
            description: string;
            restaurant_suggestion?: string;
            notes?: string;
        };
        tips?: string;
    }[];
    estimated_budget: string;
    additional_tips: string;
}
  
  export interface DayItinerary {
    day: number;
    morning: Activity;
    afternoon: Activity;
    evening: Activity;
    tips: string;  // Conseils spécifiques pour ce jour
  }
  
  export interface Activity {
    activity: string;
    description: string;  // Description de l'activité
  }
  