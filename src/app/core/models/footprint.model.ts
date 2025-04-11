// models/footprint.model.ts
export interface Footprint {
    id?: number;
    distance: number; // en km
    transportType: string;
    carbonFootprint: number; // en kg CO2
    date?: Date;
  }