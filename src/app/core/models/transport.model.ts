export interface Transport {
    id?: number;          // optional when creating a new one
    type: string;
    capacity: number;
    pricePerKm: number;
    available: boolean;
    imgUrl: string;
}
  