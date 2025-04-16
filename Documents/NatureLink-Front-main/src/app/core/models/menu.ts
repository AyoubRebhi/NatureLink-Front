export interface Menu {
  id?: number;
  plats: string;
  prixMoyen: number;
  restaurantId: number; // Référence à Restaurant
}
