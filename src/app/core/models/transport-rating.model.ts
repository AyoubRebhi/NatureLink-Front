import { Transport } from './transport.model';

export interface TransportRating {
    id?: number;
    userId: number;
    rating: number; // e.g., 1 to 5
    comment?: string;
    transport?: Transport;
    transportId?: number; // helpful for linking or filtering
  }