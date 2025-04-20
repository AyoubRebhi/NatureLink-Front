export interface Activity {
    id: number;
    name: string;
    description: string;
    providerId: number;
    location: string;
    duration: number;
    price: number;
    maxParticipants: number;
    difficultyLevel: string;
    requiredEquipment: string[];
  }
  