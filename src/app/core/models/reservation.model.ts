import { StatutReservation } from './statut-reservation.model'; // Enum for reservation status
import { User } from './user.model'; // The user making the reservation
import { TypeReservation } from './type-reservation.model'; // Enum for reservation types
export interface Reservation {
  id?: number; // Optional for creation
  userId: number; // ID of the user making the reservation
  dateDebut: Date; // Start date of the reservation
  dateFin: Date; // End date of the reservation
  statut: StatutReservation;
  typeres?:TypeReservation // Reservation status (Confirmed, Cancelled, Pending)
  packId?: number;
  packDetails?: string; // Add this property
  packName?: string; // Add this property

  // New Fields:
  numClients: number; // Number of clients involved in the reservation
  numRooms?: number; // Number of rooms (only for logement reservations)
  clientNames: string[]; // List of client names for the reservation

  logementId?: number; // ID of logement (if it's a logement reservation)
  eventId?: number; // ID of the event (if it's an event reservation)
  restaurantId?: number; // ID of the restaurant (if it's a restaurant reservation)
  transportId?: number; // ID of the transport (if it's a transport reservation)
  activityId?: number;
   // ID of the activity (if it's an activity reservation)
}
