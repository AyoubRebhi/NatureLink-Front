import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { PackService } from 'src/app/core/services/pack.service';
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
  dateDebut: string = '';
  dateFin: string = '';
  selectedStatut: StatutReservation = StatutReservation.CONFIRMED;
  statutOptions = Object.values(StatutReservation);
  userId?: number;
  numClients: number = 1;
  numRooms?: number;
  clientNames: string[] = [];
  reservationType: TypeReservation = TypeReservation.PACK; // Default to PACK

  // Type-specific IDs (retained from API)
  logementId?: number;
  transportId?: number;
  restaurantId?: number;
  activityId?: number;
  eventId?: number;
  packId?: number;

  // Store original reservation for reference
  originalReservation?: Reservation;

  constructor(
    private reservationService: ReservationService,
    private packService: PackService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.reservationId = +this.route.snapshot.paramMap.get('id')!;
    this.userId = this.authService.getCurrentUserId() || undefined;
    if (!this.userId) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.loadReservation();
  }

  private loadReservation(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        if (reservation.userId !== this.userId) {
          alert('Unauthorized: You can only update your own reservations.');
          this.router.navigate(['/reservation/reservation-list']);
          return;
        }

        this.originalReservation = reservation;

        console.log('API response for reservation:', reservation); // Debug API response

        // Populate form fields
        this.dateDebut = this.formatDateForInput(reservation.dateDebut);
        this.dateFin = this.formatDateForInput(reservation.dateFin);
        this.selectedStatut = reservation.statut || StatutReservation.CONFIRMED;
        this.numClients = reservation.numClients || 1;
        this.clientNames = [...(reservation.clientNames || [''])];
        this.numRooms = reservation.numRooms;
        this.reservationType = this.getValidReservationType(reservation.typeres, reservation.packId);
        this.logementId = reservation.logementId;
        this.transportId = reservation.transportId;
        this.restaurantId = reservation.restaurantId;
        this.activityId = reservation.activityId;
        this.eventId = reservation.eventId;
        this.packId = reservation.packId;

        console.log('Set reservationType:', this.reservationType);
        console.log('Set packId:', this.packId);
       
        if (this.reservationType === TypeReservation.PACK && !this.packId) {
          console.warn('PACK reservation loaded but packId is missing. Backend will use stored value.');
        }
      },
      error: (err) => {
        console.error('Error loading reservation:', err);
        alert('Failed to load reservation details.');
        this.router.navigate(['/reservation/reservation-list']);
      }
    });
  }

  private getValidReservationType(typeres: string | undefined | null, packId: number | undefined): TypeReservation {
    const validTypes = Object.values(TypeReservation);
    if (typeres && validTypes.includes(typeres as TypeReservation)) {
      return typeres as TypeReservation;
    }
    if (packId) {
      console.log('Using PACK as typeres due to packId presence:', packId);
      return TypeReservation.PACK;
    }
    console.warn('No valid typeres or packId. Defaulting to PACK');
    return TypeReservation.PACK;
  }

  // Check if any client names are invalid (empty or whitespace)
  hasInvalidClientNames(): boolean {
    return this.clientNames.some(name => !name.trim());
  }

  // Format date to YYYY-MM-DD for input[type=date]
  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.warn('Invalid date:', date);
      return new Date().toISOString().split('T')[0]; // Fallback to today
    }
    return d.toISOString().split('T')[0];
  }

  // Get minimum date for date inputs (today)
  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Get minimum end date (start date or today, whichever is later)
  getMinEndDate(): string {
    const startDate = new Date(this.dateDebut);
    const today = new Date();
    const minDate = startDate > today ? startDate : today;
    return this.formatDateForInput(minDate);
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
    if (!this.userId) {
      alert('Please log in to update the reservation.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (new Date(this.dateDebut) > new Date(this.dateFin)) {
      alert('Start date cannot be later than end date.');
      return;
    }

    if (this.hasInvalidClientNames()) {
      alert('Please fill in all client names.');
      return;
    }

    // Warn about missing packId but allow submission
    if (this.reservationType === TypeReservation.PACK && (this.packId === undefined || this.packId === null)) {
      console.warn('PACK reservation loaded but packId is missing. Backend will use stored value.');
    }

    const updatedReservation: Reservation = {
      id: this.reservationId,
      userId: this.userId,
      dateDebut: new Date(this.dateDebut),
      dateFin: new Date(this.dateFin),
      statut: this.selectedStatut,
      numClients: this.numClients,
      clientNames: this.clientNames.map(name => name.trim()),
      numRooms: this.reservationType === TypeReservation.LOGEMENT ? this.numRooms : undefined,
      typeres: this.reservationType,
      logementId: this.reservationType === TypeReservation.LOGEMENT ? this.logementId : undefined,
      transportId: this.reservationType === TypeReservation.TRANSPORT ? this.transportId : undefined,
      restaurantId: this.reservationType === TypeReservation.RESTAURANT ? this.restaurantId : undefined,
      activityId: this.reservationType === TypeReservation.ACTIVITE ? this.activityId : undefined,
      eventId: this.reservationType === TypeReservation.EVENT ? this.eventId : undefined,
      packId: this.reservationType === TypeReservation.PACK ? this.packId : undefined
    };

    console.log('Submitting updated reservation:', updatedReservation);

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