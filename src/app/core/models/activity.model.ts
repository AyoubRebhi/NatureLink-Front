export interface Activity {
    id?: number;
    name: string;
    description: string;
    providerId?: number;
    location: string;
    duration: number; // in minutes or hours
    price: number;
    maxParticipants: number;
    difficultyLevel: string;
    requiredEquipment: string[]; // list of equipment
    imageUrls?: string[]; // Cloudinary image URLs
    // 🧠 AI Matching Fields
    type: string; // e.g., "Adventure", "Relaxation", "Cultural"
    mood: string[]; // e.g., ["exciting", "thrilling"]
    tags: string[]; // e.g., ["nature", "family-friendly"]
    similarity?: number; // Only present in recommendations

}
