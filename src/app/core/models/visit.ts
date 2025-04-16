export interface Visit {
  id: number;
  date: string;
  time: string;
  price: number;
  duration: string;
  monument?: {
    id: number;
    nom: string;
  };
  guide?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  nomMonument?: string;
  nomGuide?: string;
}
