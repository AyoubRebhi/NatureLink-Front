import { TransportType } from "../enums/transport-type.enum";

export interface Transport {
    id?: number;          // optional when creating a new one
    type: TransportType;  // Changed from string to TransportType
    capacity: number;
    pricePerKm: number;
    available: boolean;
    imgUrl: string;
    description?: string; // ✅ new field
    agenceId: number;
}
  