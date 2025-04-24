import { Visit } from "./visit";

// guide.model.ts
export interface Guide {
  id?: number;
  firstName?: string;
  lastName?: string;
  visits?: Visit[];
}
