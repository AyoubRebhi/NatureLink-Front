export interface Unit {
    id?: number;
    unitType: string;
    pricePerNight: number;
    logementId: number; // only ID sent to backend
  }