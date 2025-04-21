import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { StatutReservation } from 'src/app/core/models/statut-reservation.model'; // Enum for reservation status
import { TypeReservation } from 'src/app/core/models/type-reservation.model'; // Enum for reservation types

@Component({
  selector: 'app-update-reservation',
  templateUrl: './reservation-update.component.html',
  styleUrls: ['./reservation-update.component.scss']
})
export class ReservationUpdateComponent implements OnInit {
  reservationId: number = 0;

  // Form Fields
  username: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  selectedStatut: StatutReservation = StatutReservation.CONFIRMEE;
  statutOptions = Object.values(StatutReservation);
  userId?: number; // User ID (to be set dynamically)
  numClients: number = 1; // Number of clients
  numRooms?: number; // Number of rooms for logement reservation
  clientNames: string[] = []; // List of client names

  // Optional Fields
  logementId?: number; // Logement ID (only for logement type)
  transportId?: number; // Transport ID (only for transport type)
  restaurantId?: number; // Restaurant ID (only for restaurant type)
  activityId?: number; // Activity ID (only for activity type)

  reservationType: TypeReservation = TypeReservation.LOGEMENT; // Assuming default type is Logement

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the reservation ID from the route parameters
    this.reservationId = +this.route.snapshot.paramMap.get('id')!;
    
    // Load the reservation details
    this.loadReservation();
  }

  private loadReservation(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        // Populate the form with the current reservation data
        if (reservation) {
          this.username = reservation.clientNames[0]; // Assuming the first client name is the username
          this.dateDebut = reservation.dateDebut.toString().split('T')[0];  // Format to "YYYY-MM-DD"
          this.dateFin = reservation.dateFin.toString().split('T')[0];  // Format to "YYYY-MM-DD"
          this.selectedStatut = reservation.statut;
          this.numClients = reservation.numClients;
          this.clientNames = [...reservation.clientNames];  // Set client names array
          this.numRooms = reservation.numRooms;
          this.logementId = reservation.logementId;
          this.transportId = reservation.transportId;
          this.restaurantId = reservation.restaurantId;
          this.activityId = reservation.activityId;
          this.userId= reservation.userId; // Set user ID
          // Set the reservation type
          if (this.logementId) {
            this.reservationType = TypeReservation.LOGEMENT;
          } else if (this.transportId) {
            this.reservationType = TypeReservation.TRANSPORT;
          } else if (this.restaurantId) {
            this.reservationType = TypeReservation.RESTAURANT;
          } else if (this.activityId) {
            this.reservationType = TypeReservation.ACTIVITE;
          }
        }
      },
      error: (err) => {
        console.error('Error loading reservation:', err);
      }
    });
  }

  // Function to dynamically handle client names array
  addClientField() {
    this.clientNames.push('');  // Add an empty string to the client names array
    this.numClients = this.clientNames.length;
  }

  removeClientField(index: number) {
    if (this.clientNames.length > 1) {
      this.clientNames.splice(index, 1);  // Remove the client name at the given index
      this.numClients = this.clientNames.length;
    }
  }

  // TrackBy function to prevent re-renders
  trackByIndex(index: number): number {
    return index;
  }

  updateReservation(): void {
    // Validate dates before submission
    if (new Date(this.dateDebut) > new Date(this.dateFin)) {
      alert('Start date cannot be later than end date');
      return;
    }

    // Create a reservation object with updated values
    const updatedReservation: Reservation = {
      id: this.reservationId,
      userId: this.userId!,  // Dynamically set user ID
      dateDebut: new Date(this.dateDebut),
      dateFin: new Date(this.dateFin),
      statut: this.selectedStatut,
      numClients: this.numClients,
      clientNames: this.clientNames,
      numRooms: this.numRooms,
      logementId: this.logementId,  // Only for logement type
      transportId: this.transportId, // Only for transport type
      restaurantId: this.restaurantId, // Only for restaurant type
      activityId: this.activityId, // Only for activity type
    };

    // Call the service to update the reservation
    this.reservationService.updateReservation(this.reservationId, updatedReservation).subscribe({
      next: (response) => {
        console.log('Reservation updated successfully:', response);
        alert('Reservation updated successfully!');
        this.router.navigate(['/reservation/reservation-list']);  // Redirect back to the reservation list
      },
      error: (error) => {
        console.error('Error updating reservation:', error);
      
        if (error.error && error.error.message) {
          alert(`⚠️ ${error.error.message}`);
        } else if (error.status === 500 && error.error) {
          alert(`⚠️ ${error.error}`);
        } else {
          alert('❌ Failed to update reservation. Please try again.');
        }
      }
      
    });
  }

  // Navigate back to the reservation list
  goBackToList(): void {
    this.router.navigate(['/reservation/reservation-list']);
  }
}
