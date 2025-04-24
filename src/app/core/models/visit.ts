// visit.model.ts
import { Monument } from './monument';
import { Guide } from './guide';

export interface Visit {
  id?: number;
  date: string; // ou LocalDate si vous utilisez une librairie de gestion de dates
  time: string; // ou LocalTime
  price: number;
  duration: string;
  monument: Monument;
  guide: Guide;
}
