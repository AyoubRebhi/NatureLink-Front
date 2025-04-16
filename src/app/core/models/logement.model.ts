export enum LogementType {
  HOUSE = 'HOUSE',
  CABIN = 'CABIN',
  TENT = 'TENT',
  MAISON_DHOTE = 'MAISON_DHOTE',
}

export interface Equipement {
  id: number;
  name: string;
  description?: string;
}

export interface Logement {
  id?: number;
  titre: string;
  description: string;
  location: string;
  type: LogementType;
  price: number;
  proprietarield: number;
  phone: string;
  email: string;
  capacity: number;
  socialMedia: string;
  images?: string[]; // updated to list of images
  singleRooms?: number;
  doubleRooms?: number;
  equipements?: Equipement[];
  latitude?: number;
  longitude?: number;
}

