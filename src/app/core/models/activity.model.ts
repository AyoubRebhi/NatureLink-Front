export interface Activity {
    id?: number;
    name: string;
    description: string;
    providerId: number;
    location: string;
    duration: number; // in minutes or hours
    price: number;
    maxParticipants: number;
    difficultyLevel: string;
    requiredEquipment: string[]; // list of equipment
    imageUrls?: string[]; // Cloudinary image URLs
}
  