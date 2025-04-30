import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { PackService } from 'src/app/core/services/pack.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { StatutReservation } from 'src/app/core/models/statut-reservation.model';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';
import { AuthService } from 'src/app/core/services/auth.service';

interface EnhancedReservation extends Reservation {
  reservationTime?: string;
  tablePreference?: string;
}

@Component({
  selector: 'app-update-reservation',
  templateUrl: './reservation-update.component.html',
  styleUrls: ['./reservation-update.component.scss']
})
export class ReservationUpdateComponent implements OnInit {
  reservationId: number = 0;
  isLoading: boolean = false;
  reservationForm: FormGroup;
  TypeReservation = TypeReservation; // Expose enum to template

  // Form Fields
  dateDebut: string = '';
  dateFin: string = '';
  selectedStatut: StatutReservation = StatutReservation.CONFIRMED;
  statutOptions = Object.values(StatutReservation);
  userId?: number;
  numClients: number = 1;
  numRooms?: number;
  clientNames: string[] = [];
  reservationType: TypeReservation = TypeReservation.PACK;
  reservationTime: string = '';
  tablePreference: string = ''; // Added for restaurant reservations

  // Type-specific IDs
  logementId?: number;
  transportId?: number;
  restaurantId?: number;
  activityId?: number;
  eventId?: number;
  packId?: number;

  // Store original reservation
  originalReservation?: EnhancedReservation;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private packService: PackService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.reservationForm = this.fb.group({});
  }

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

    this.initializeForm();
    this.loadReservation();
  }

  private initializeForm(): void {
    this.reservationForm = this.fb.group({
      numClients: [this.numClients, [Validators.required, Validators.min(1)]],
      dateDebut: [this.dateDebut, Validators.required],
      dateFin: [this.dateFin],
      numRooms: [this.numRooms, [Validators.min(1)]],
      reservationTime: [this.reservationTime],
      tablePreference: [this.tablePreference],
      selectedStatut: [this.selectedStatut, Validators.required]
    });

    // Add controls for client names
    this.clientNames.forEach((name, i) => {
      this.reservationForm.addControl(`clientName${i}`, this.fb.control(name, Validators.required));
    });

    this.updateValidatorsBasedOnType();
  }

  private loadReservation(): void {
    this.isLoading = true;
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        if (reservation.userId !== this.userId) {
          alert('Unauthorized: You can only update your own reservations.');
          this.router.navigate(['/reservation/reservation-list']);
          return;
        }

        // Enhance reservation with localStorage data for restaurant reservations
        const enhancedReservation: EnhancedReservation = { ...reservation };
        if (reservation.typeres === TypeReservation.RESTAURANT) {
          const storedDetails = localStorage.getItem(`reservation_${reservation.id}`);
          if (storedDetails) {
            const { reservationTime, tablePreference } = JSON.parse(storedDetails);
            enhancedReservation.reservationTime = reservationTime || '';
            enhancedReservation.tablePreference = tablePreference || '';
          }
        }

        this.originalReservation = enhancedReservation;
        this.populateFormFields(enhancedReservation);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reservation:', err);
        alert('Failed to load reservation details.');
        this.router.navigate(['/reservation/reservation-list']);
        this.isLoading = false;
      }
    });
  }

  private populateFormFields(reservation: EnhancedReservation): void {
    this.dateDebut = this.formatDateForInput(reservation.dateDebut);
    this.dateFin = this.formatDateForInput(reservation.dateFin);
    this.selectedStatut = reservation.statut || StatutReservation.CONFIRMED;
    this.numClients = reservation.numClients || 1;
    this.clientNames = [...(reservation.clientNames || [''])];
    this.numRooms = reservation.numRooms;
    this.reservationType = this.getValidReservationType(reservation.typeres, reservation.packId);
    this.reservationTime = reservation.reservationTime || '';
    this.tablePreference = reservation.tablePreference || '';

    // Set type-specific IDs
    this.logementId = reservation.logementId;
    this.transportId = reservation.transportId;
    this.restaurantId = reservation.restaurantId;
    this.activityId = reservation.activityId;
    this.eventId = reservation.eventId;
    this.packId = reservation.packId;

    // Update form values
    this.reservationForm.patchValue({
      numClients: this.numClients,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      numRooms: this.numRooms,
      reservationTime: this.reservationTime,
      tablePreference: this.tablePreference,
      selectedStatut: this.selectedStatut
    });

    // Reinitialize client name controls
    this.clientNames.forEach((name, i) => {
      if (!this.reservationForm.get(`clientName${i}`)) {
        this.reservationForm.addControl(`clientName${i}`, this.fb.control(name, Validators.required));
      } else {
        this.reservationForm.get(`clientName${i}`)?.setValue(name);
      }
    });

    // Update validators based on reservation type
    this.updateValidatorsBasedOnType();
  }

  private getValidReservationType(typeres: string | undefined | null, packId: number | undefined): TypeReservation {
    const validTypes = Object.values(TypeReservation);
    if (typeres && validTypes.includes(typeres as TypeReservation)) {
      return typeres as TypeReservation;
    }
    return packId ? TypeReservation.PACK : TypeReservation.PACK;
  }

  private updateValidatorsBasedOnType(): void {
    const reservationTimeControl = this.reservationForm.get('reservationTime');
    const dateFinControl = this.reservationForm.get('dateFin');
    const numClientsControl = this.reservationForm.get('numClients');

    if (this.reservationType === TypeReservation.RESTAURANT) {
      reservationTimeControl?.setValidators([Validators.required]);
      dateFinControl?.clearValidators();
      numClientsControl?.setValidators([Validators.required, Validators.min(1), Validators.max(4)]);
    } else {
      reservationTimeControl?.clearValidators();
      dateFinControl?.setValidators([Validators.required]);
      numClientsControl?.setValidators([Validators.required, Validators.min(1)]);
    }

    reservationTimeControl?.updateValueAndValidity();
    dateFinControl?.updateValueAndValidity();
    numClientsControl?.updateValueAndValidity();
  }

  hasInvalidClientNames(): boolean {
    return this.clientNames.some(name => !name.trim());
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMinEndDate(): string {
    const startDate = new Date(this.dateDebut);
    const today = new Date();
    return this.formatDateForInput(startDate > today ? startDate : today);
  }

  addClientField(): void {
    if (this.reservationType === TypeReservation.RESTAURANT && this.clientNames.length >= 4) {
      return;
    }
    this.clientNames.push('');
    this.reservationForm.addControl(`clientName${this.clientNames.length - 1}`, this.fb.control('', Validators.required));
    this.reservationForm.get('numClients')?.setValue(this.clientNames.length);
  }

  removeClientField(index: number): void {
    if (this.clientNames.length > 1) {
      this.clientNames.splice(index, 1);
      this.reservationForm.removeControl(`clientName${index}`);
      // Reindex remaining controls
      for (let i = index; i < this.clientNames.length; i++) {
        const control = this.reservationForm.get(`clientName${i + 1}`);
        if (control) {
          this.reservationForm.addControl(`clientName${i}`, control);
          this.reservationForm.removeControl(`clientName${i + 1}`);
        }
      }
      this.reservationForm.get('numClients')?.setValue(this.clientNames.length);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  updateReservation(): void {
    if (this.reservationForm.invalid) {
      this.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
      return;
    }

    if (!this.userId) {
      alert('Please log in to update the reservation.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (this.reservationType !== TypeReservation.RESTAURANT && new Date(this.dateDebut) > new Date(this.dateFin)) {
      alert('Start date cannot be later than end date.');
      return;
    }

    if (this.hasInvalidClientNames()) {
      alert('Please fill in all client names.');
      return;
    }

    if (this.reservationType === TypeReservation.RESTAURANT && this.clientNames.length > 4) {
      alert('Restaurant reservations are limited to 4 persons maximum.');
      return;
    }

    this.isLoading = true;

    // Combine dateDebut with reservationTime for restaurant reservations
    let effectiveDateDebut = new Date(this.dateDebut);
    if (this.reservationType === TypeReservation.RESTAURANT && this.reservationTime) {
      const [hours, minutes] = this.reservationTime.split(':').map(Number);
      effectiveDateDebut.setHours(hours, minutes, 0, 0);
    }

    // Set dateFin to dateDebut for restaurant reservations
    const effectiveDateFin = this.reservationType === TypeReservation.RESTAURANT
      ? new Date(effectiveDateDebut)
      : new Date(this.dateFin);

    const updatedReservation: Reservation = {
      id: this.reservationId,
      userId: this.userId,
      dateDebut: effectiveDateDebut,
      dateFin: effectiveDateFin,
      statut: this.selectedStatut,
      numClients: this.clientNames.length,
      clientNames: this.clientNames.map(name => name.trim()),
      numRooms: this.reservationType === TypeReservation.LOGEMENT ? this.numRooms : undefined,
      typeres: this.reservationType,
      logementId: this.logementId,
      transportId: this.transportId,
      restaurantId: this.restaurantId,
      activityId: this.activityId,
      eventId: this.eventId,
      packId: this.packId
    };

    // Update the reservation
    this.reservationService.updateReservation(this.reservationId, updatedReservation).subscribe({
      next: (response) => {
        // Save restaurant-specific fields to localStorage
        if (this.reservationType === TypeReservation.RESTAURANT) {
          const restaurantDetails = {
            reservationTime: this.reservationTime,
            tablePreference: this.tablePreference || 'No preference'
          };
          localStorage.setItem(`reservation_${this.reservationId}`, JSON.stringify(restaurantDetails));
          console.log(`Stored restaurant details for reservation ${this.reservationId}:`, restaurantDetails);
        }

        alert('Reservation updated successfully!');
        this.router.navigate(['/reservation/reservation-list']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating reservation:', error);
        alert(error.error?.message || 'Failed to update reservation. Please try again.');
        this.isLoading = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.reservationForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  goBackToList(): void {
    this.router.navigate(['/reservation/reservation-list']);
  }
}