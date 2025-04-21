export interface PackDTO {
    id?: number;
    nom: string;
    prix: number;
    description: string;
    logements?: number[];     // Optional
    restaurants?: number[];   // Optional
    activities?: number[];    // Optional
    transports?: number[];    // Optional
    evenements?: number[];    // Optional
    userId?: number;
    averageRating?: number;
    imageUrl?: string;  // Add this for average rating

  }
  
  export interface Pack {
    id: number;
    nom: string;
    prix: number;
    description: string;
    logements: any[];     // You can define real types if needed
    restaurants: any[];
    activities: any[];
    transports: any[];
    evenements: any[];
    user: any;  
    averageRating?: number;  
    // Add this field for average rating
    // You can define a `User` interface too
  }
  export interface RatingDTO {
    reservationId: number;
    ratingValue: number;
    userId: number;
    
  }