// src/app/components/reservation-list/reservation-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  selectedReservation?: Reservation;
  userId = 8; // Replace with actual user ID (e.g., from auth service)
  searchQuery: string = '';
  selectedType: TypeReservation | '' = '';
  showModal: boolean = false;
  showUpcoming: boolean = true; // Default to upcoming reservations

  typeReservations = Object.values(TypeReservation);

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    const serviceCall = this.showUpcoming
      ? this.reservationService.getUpcomingReservationsByUserId(this.userId)
      : this.reservationService.getReservationsByUserId(this.userId);

    serviceCall.subscribe({
      next: (data) => {
        console.log('Raw API Response:', data);

        if (!data || !Array.isArray(data)) {
          console.error('Invalid data format:', data);
          this.reservations = [];
          return;
        }

        this.reservations = data
          .filter(reservation => {
            if (this.showUpcoming) {
              return true; // Already filtered by backend
            } else {
              // Filter for past reservations (dateFin < today)
              return new Date(reservation.dateFin) < new Date();
            }
          })
          .map((reservation) => {
            let typeres: TypeReservation | undefined;
            if (reservation.typeres && Object.values(TypeReservation).includes(reservation.typeres)) {
              typeres = reservation.typeres as TypeReservation;
            } else if (reservation.logementId) {
              typeres = TypeReservation.LOGEMENT;
            } else if (reservation.activityId) {
              typeres = TypeReservation.ACTIVITE;
            } else if (reservation.restaurantId) {
              typeres = TypeReservation.RESTAURANT;
            } else if (reservation.eventId) {
              typeres = TypeReservation.EVENT;
            } else if (reservation.transportId) {
              typeres = TypeReservation.TRANSPORT;
            }

            return {
              ...reservation,
              id: reservation.id,
              userId: reservation.userId,
              dateDebut: new Date(reservation.dateDebut),
              dateFin: new Date(reservation.dateFin),
              statut: reservation.statut,
              logementId: reservation.logementId,
              numClients: reservation.numClients,
              clientNames: reservation.clientNames,
              numRooms: reservation.numRooms,
              typeres
            };
          });

        console.log('Mapped Reservations:', this.reservations);
        this.filterReservations();
      },
      error: (error) => {
        console.error(`Error fetching ${this.showUpcoming ? 'upcoming' : 'past'} reservations:`, error);
        this.reservations = [];
        this.filterReservations();
      }
    });
  }

  filterReservations(): void {
    console.log('Filtering with query:', this.searchQuery);
    console.log('Selected Type:', this.selectedType);

    this.filteredReservations = this.reservations.filter((reservation) => {
      const matchesSearch = this.searchQuery
        ? reservation.clientNames?.some((name) =>
            name.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        : true;

      const matchesType = this.selectedType
        ? reservation.typeres === this.selectedType
        : true;

      console.log('Reservation:', reservation);
      console.log('Matches search:', matchesSearch);
      console.log('Matches type:', matchesType);

      return matchesSearch && matchesType;
    });

    console.log('Filtered Reservations:', this.filteredReservations);
  }

  selectReservation(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReservation = undefined;
  }

  goToAdd(): void {
    this.router.navigate(['/reservation/create']);
  }

  goToUpdate(id?: number): void {
    if (id === undefined || id === null) {
      alert('Cannot update: Reservation ID is missing');
      return;
    }
    this.router.navigate(['/reservation/update', id]);
  }

  deleteReservation(id: number): void {
    if (id === undefined || id === null) {
      alert('Reservation ID is missing.');
      return;
    }

    if (confirm('Are you sure you want to delete this reservation?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.loadReservations();
          this.selectedReservation = undefined;
        },
        error: (error) => {
          console.error('Error deleting reservation:', error);
          alert('Failed to delete reservation');
        }
      });
    }
  }

  downloadPDF(id: number): void {
    this.reservationService.downloadReservationPDF(id).subscribe(
      (response: Blob) => {
        const blobUrl = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `reservation_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      },
      (error) => {
        console.error('Error downloading PDF:', error);
        alert('Failed to download the reservation PDF.');
      }
    );
  }

  toggleView(): void {
    this.showUpcoming = !this.showUpcoming;
    this.loadReservations();
  }
}