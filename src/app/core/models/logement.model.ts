import { EquipementType } from './equipement-type.enum';  // Import EquipementType Enum

export interface Logement {
    id: number;
    titre: string;
    description: string;
    location: string;
    equipment: EquipementType;
    price: number;
    image: string;
    proprietarield: number;
    phone: string;
    email: string;
    socialMedia: string;
  }
  