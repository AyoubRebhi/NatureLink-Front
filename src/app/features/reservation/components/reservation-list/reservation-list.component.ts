// reservation-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';
import { AuthService } from 'src/app/core/services/auth.service';

interface ReservationStats {
  totalReservations: number;
  byType: { [key in TypeReservation]: number };
  byStatus: { confirmed: number; pending: number; canceled: number };
  totalClients: number;
  mostFrequentType: string;
}

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  reservationStats: ReservationStats = {
    totalReservations: 0,
    byType: {
      [TypeReservation.ACTIVITE]: 0,
      [TypeReservation.LOGEMENT]: 0,
      [TypeReservation.RESTAURANT]: 0,
      [TypeReservation.EVENT]: 0,
      [TypeReservation.TRANSPORT]: 0
    },
    byStatus: { confirmed: 0, pending: 0, canceled: 0 },
    totalClients: 0,
    mostFrequentType: ''
  };
  selectedReservation?: Reservation;
  searchQuery: string = '';
  selectedType: TypeReservation | '' = '';
  showModal: boolean = false;
  showUpcoming: boolean = true; // Default to upcoming reservations

  typeReservations = Object.values(TypeReservation);

  constructor(
    private reservationService: ReservationService,
    private router: Router,
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
    this.loadReservations();
  }

  loadReservations(): void {
    // Get the current user's ID
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    const serviceCall = this.showUpcoming
      ? this.reservationService.getUpcomingReservationsByUserId(userId)
      : this.reservationService.getReservationsByUserId(userId);

    serviceCall.subscribe({
      next: (data) => {
        console.log('Raw API Response:', data);

        if (!data || !Array.isArray(data)) {
          console.error('Invalid data format:', data);
          this.reservations = [];
          this.updateStatistics();
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
        this.updateStatistics();
        this.filterReservations();
      },
      error: (error) => {
        console.error(`Error fetching ${this.showUpcoming ? 'upcoming' : 'past'} reservations:`, error);
        this.reservations = [];
        this.updateStatistics();
        this.filterReservations();
      }
    });
  }

  updateStatistics(): void {
    // Reset stats
    this.reservationStats = {
      totalReservations: this.reservations.length,
      byType: {
        [TypeReservation.ACTIVITE]: 0,
        [TypeReservation.LOGEMENT]: 0,
        [TypeReservation.RESTAURANT]: 0,
        [TypeReservation.EVENT]: 0,
        [TypeReservation.TRANSPORT]: 0
      },
      byStatus: { confirmed: 0, pending: 0, canceled: 0 },
      totalClients: 0,
      mostFrequentType: ''
    };

    // Compute stats
    this.reservations.forEach(reservation => {
      // By type
      if (reservation.typeres) {
        this.reservationStats.byType[reservation.typeres]++;
      }

      // By status
      if (reservation.statut) {
        const status = reservation.statut.toLowerCase();
        if (status.includes('confirm')) {
          this.reservationStats.byStatus.confirmed++;
        } else if (status.includes('attente') || status.includes('pending')) {
          this.reservationStats.byStatus.pending++;
        } else if (status.includes('annul') || status.includes('canceled')) {
          this.reservationStats.byStatus.canceled++;
        }
      }

      // Total clients
      if (reservation.numClients) {
        this.reservationStats.totalClients += reservation.numClients;
      }
    });

    // Find most frequent type
    const typeCounts = Object.entries(this.reservationStats.byType) as [TypeReservation, number][];
    const mostFrequent = typeCounts.reduce((max, [type, count]) => 
      count > max.count ? { type, count } : max, 
      { type: '', count: 0 }
    );
    this.reservationStats.mostFrequentType = mostFrequent.type || 'None';
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