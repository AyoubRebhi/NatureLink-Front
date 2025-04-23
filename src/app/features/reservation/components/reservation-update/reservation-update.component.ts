// reservation-update.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { StatutReservation } from 'src/app/core/models/statut-reservation.model';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';
import { AuthService } from 'src/app/core/services/auth.service';

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
  userId?: number; // User ID (set from AuthService)
  numClients: number = 1;
  numRooms?: number;
  clientNames: string[] = [];

  // Optional Fields
  logementId?: number;
  transportId?: number;
  restaurantId?: number;
  activityId?: number;

  reservationType: TypeReservation = TypeReservation.LOGEMENT;

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Get the reservation ID from the route parameters
    this.reservationId = +this.route.snapshot.paramMap.get('id')!;

    // Set userId from AuthService
    this.userId = this.authService.getCurrentUserId() || undefined;
    if (!this.userId) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Load the reservation details
    this.loadReservation();
  }

  private loadReservation(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        // Verify the reservation belongs to the authenticated user
        if (reservation.userId !== this.userId) {
          alert('Unauthorized: You can only update your own reservations.');
          this.router.navigate(['/reservation/reservation-list']);
          return;
        }

        // Populate the form with the current reservation data
        if (reservation) {
          this.username = reservation.clientNames[0]; // Assuming the first client name is the username
          this.dateDebut = reservation.dateDebut.toString().split('T')[0];
          this.dateFin = reservation.dateFin.toString().split('T')[0];
          this.selectedStatut = reservation.statut;
          this.numClients = reservation.numClients;
          this.clientNames = [...reservation.clientNames];
          this.numRooms = reservation.numRooms;
          this.logementId = reservation.logementId;
          this.transportId = reservation.transportId;
          this.restaurantId = reservation.restaurantId;
          this.activityId = reservation.activityId;

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
        alert('Failed to load reservation details.');
        this.router.navigate(['/reservation/reservation-list']);
      }
    });
  }

  addClientField() {
    this.clientNames.push('');
    this.numClients = this.clientNames.length;
  }

  removeClientField(index: number) {
    if (this.clientNames.length > 1) {
      this.clientNames.splice(index, 1);
      this.numClients = this.clientNames.length;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  updateReservation(): void {
    // Validate userId
    if (!this.userId) {
      alert('Please log in to update the reservation.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Validate dates
    if (new Date(this.dateDebut) > new Date(this.dateFin)) {
      alert('Start date cannot be later than end date');
      return;
    }

    // Validate client names
    if (this.clientNames.some(name => !name.trim())) {
      alert('Please fill in all client names.');
      return;
    }

    // Create a reservation object with updated values
    const updatedReservation: Reservation = {
      id: this.reservationId,
      userId: this.userId,
      dateDebut: new Date(this.dateDebut),
      dateFin: new Date(this.dateFin),
      statut: this.selectedStatut,
      numClients: this.numClients,
      clientNames: this.clientNames.map(name => name.trim()),
      numRooms: this.numRooms,
      logementId: this.logementId,
      transportId: this.transportId,
      restaurantId: this.restaurantId,
      activityId: this.activityId
    };

    // Call the service to update the reservation
    this.reservationService.updateReservation(this.reservationId, updatedReservation).subscribe({
      next: (response) => {
        console.log('Reservation updated successfully:', response);
        alert('Reservation updated successfully!');
        this.router.navigate(['/reservation/reservation-list']);
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

  goBackToList(): void {
    this.router.navigate(['/reservation/reservation-list']);
  }
}