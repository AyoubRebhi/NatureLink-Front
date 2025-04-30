import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { StatutReservation } from 'src/app/core/models/statut-reservation.model';
import { PackService } from 'src/app/core/services/pack.service';

interface EnhancedReservation extends Reservation {
  reservationTime?: string;
  tablePreference?: string;
}

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
  reservations: EnhancedReservation[] = [];
  filteredReservations: EnhancedReservation[] = [];
  reservationStats: ReservationStats = {
    totalReservations: 0,
    byType: {
      [TypeReservation.ACTIVITE]: 0,
      [TypeReservation.LOGEMENT]: 0,
      [TypeReservation.RESTAURANT]: 0,
      [TypeReservation.EVENT]: 0,
      [TypeReservation.TRANSPORT]: 0,
      [TypeReservation.PACK]: 0
    },
    byStatus: { confirmed: 0, pending: 0, canceled: 0 },
    totalClients: 0,
    mostFrequentType: ''
  };
  selectedReservation?: EnhancedReservation;
  searchQuery: string = '';
  selectedType: TypeReservation | '' = '';
  showModal: boolean = false;
  showReservationTypePopup: boolean = false;
  showUpcoming: boolean = true;
  typeReservations = Object.values(TypeReservation);
  TypeReservation = TypeReservation;
  selectedPackDetails: string | null = null;

  constructor(
    private reservationService: ReservationService,
    private packService: PackService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.loadReservations();
  }

  loadReservations(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.error('No userId found, redirecting to login');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const now = new Date();

    let serviceCall = this.showUpcoming
      ? this.reservationService.getUpcomingReservationsByUserId(userId)
      : this.reservationService.getReservationsByUserId(userId);

    serviceCall.subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data)) {
          console.error('Invalid data format:', data);
          this.reservations = [];
          this.updateStatistics();
          this.filterReservations();
          return;
        }

        console.log(`Raw ${this.showUpcoming ? 'upcoming' : 'history'} reservations:`, JSON.stringify(data, null, 2));

        let mappedReservations = data
          .map(reservation => this.mapReservation(reservation))
          .filter(reservation => {
            const isValid = reservation.dateDebut && reservation.dateFin && !isNaN(reservation.dateDebut.getTime()) && !isNaN(reservation.dateFin.getTime());
            if (!isValid) {
              console.warn('Invalid reservation filtered out:', reservation);
            }
            return isValid;
          });

        this.updateReservationStatuses(mappedReservations, now).then(() => {
          if (this.showUpcoming) {
            this.reservations = mappedReservations.filter(res => {
              const isUpcoming = res.dateDebut >= now && res.statut !== StatutReservation.CANCELLED;
              if (!isUpcoming) {
                console.warn('Non-upcoming or cancelled reservation found in upcoming list:', res);
              }
              return isUpcoming;
            });
          } else {
            this.reservations = mappedReservations.filter(res => {
              const isHistory = res.statut === StatutReservation.CANCELLED || 
                               (res.statut === StatutReservation.CONFIRMED && res.dateFin < now);
              return isHistory;
            });
          }

          console.log(`Mapped ${this.showUpcoming ? 'upcoming' : 'history'} reservations:`, JSON.stringify(this.reservations, null, 2));

          const packReservations = this.reservations.filter(r => r.packId);
          if (packReservations.length > 0) {
            this.fetchPackNames(packReservations);
          }

          this.updateStatistics();
          this.filterReservations();
        });
      },
      error: (error) => {
        console.error(`Error fetching ${this.showUpcoming ? 'upcoming' : 'history'} reservations:`, error);
        this.reservations = [];
        this.updateStatistics();
        this.filterReservations();
      }
    });
  }

  private async updateReservationStatuses(reservations: EnhancedReservation[], now: Date): Promise<void> {
    const updatePromises = reservations.map(res => {
      let newStatus: StatutReservation | undefined;

      if (res.statut === StatutReservation.PENDING && res.dateDebut < now) {
        newStatus = StatutReservation.CANCELLED;
      }

      if (newStatus) {
        const updatedRes = { ...res, statut: newStatus };
        return this.reservationService.updateReservation(res.id!, updatedRes).toPromise()
          .then(() => {
            res.statut = newStatus!;
            console.log(`Successfully updated reservation ${res.id} to ${newStatus}`);
          })
          .catch(error => {
            console.error(`Error updating reservation ${res.id} to ${newStatus}:`, error);
            res.statut = newStatus!;
            console.log(`Fallback: Locally updated reservation ${res.id} to ${newStatus}`);
          });
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);
  }

  private mapReservation(reservation: any): EnhancedReservation {
    let statut: StatutReservation = reservation.statut as StatutReservation;

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
    } else if (reservation.packId) {
      typeres = TypeReservation.PACK;
    } else {
      console.warn('Unknown reservation type:', reservation);
    }

    const dateDebut = reservation.dateDebut
      ? new Date(reservation.dateDebut)
      : new Date();
    const dateFin = reservation.dateFin
      ? new Date(reservation.dateFin)
      : new Date();

    if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime())) {
      console.warn('Invalid dates in reservation:', reservation);
    }

    const enhancedReservation: EnhancedReservation = {
      id: reservation.id,
      userId: reservation.userId,
      dateDebut,
      dateFin,
      statut,
      logementId: reservation.logementId,
      activityId: reservation.activityId,
      transportId: reservation.transportId,
      restaurantId: reservation.restaurantId,
      eventId: reservation.eventId,
      packId: reservation.packId,
      packName: reservation.packName,
      numClients: reservation.numClients || 0,
      clientNames: reservation.clientNames || [],
      numRooms: reservation.numRooms || 0,
      typeres
    };

    // Load restaurant-specific fields from localStorage
    if (typeres === TypeReservation.RESTAURANT && reservation.id) {
      const storedDetails = localStorage.getItem(`reservation_${reservation.id}`);
      if (storedDetails) {
        const { reservationTime, tablePreference } = JSON.parse(storedDetails);
        enhancedReservation.reservationTime = reservationTime;
        enhancedReservation.tablePreference = tablePreference || 'No preference';
      }
    }

    return enhancedReservation;
  }

  private fetchPackNames(packReservations: EnhancedReservation[]): void {
    const packIds = [...new Set(packReservations.map(r => r.packId))] as number[];
    
    packIds.forEach(packId => {
      this.packService.getPackById(packId).subscribe({
        next: (pack) => {
          this.reservations.forEach(r => {
            if (r.packId === packId) {
              r.packName = pack.nom;
            }
          });
          this.filteredReservations.forEach(r => {
            if (r.packId === packId) {
              r.packName = pack.nom;
            }
          });
        },
        error: (error) => {
          console.error(`Error fetching pack ${packId}:`, error);
        }
      });
    });
  }

  updateStatistics(): void {
    this.reservationStats = {
      totalReservations: this.reservations.length,
      byType: {
        [TypeReservation.ACTIVITE]: 0,
        [TypeReservation.LOGEMENT]: 0,
        [TypeReservation.RESTAURANT]: 0,
        [TypeReservation.EVENT]: 0,
        [TypeReservation.TRANSPORT]: 0,
        [TypeReservation.PACK]: 0
      },
      byStatus: { confirmed: 0, pending: 0, canceled: 0 },
      totalClients: 0,
      mostFrequentType: ''
    };

    this.reservations.forEach(reservation => {
      if (reservation.typeres) {
        this.reservationStats.byType[reservation.typeres]++;
      }

      if (reservation.statut) {
        const status = reservation.statut.toLowerCase();
        if (status.includes('confirm')) {
          this.reservationStats.byStatus.confirmed++;
        } else if (status.includes('pending')) {
          this.reservationStats.byStatus.pending++;
        } else if (status.includes('cancelled')) {
          this.reservationStats.byStatus.canceled++;
        }
      }

      if (reservation.numClients) {
        this.reservationStats.totalClients += reservation.numClients;
      }
    });

    const typeCounts = Object.entries(this.reservationStats.byType) as [TypeReservation, number][];
    const mostFrequent = typeCounts.reduce((max, [type, count]) =>
      count > max.count ? { type, count } : max,
      { type: '', count: 0 }
    );
    this.reservationStats.mostFrequentType = mostFrequent.type || 'None';
  }

  filterReservations(): void {
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

    console.log('Filtered reservations:', JSON.stringify(this.filteredReservations, null, 2));
  }

  selectReservation(reservation: EnhancedReservation): void {
    this.selectedReservation = reservation;
    this.showModal = true;
    this.selectedPackDetails = null;

    if (reservation.packId) {
      this.packService.getPackById(reservation.packId).subscribe({
        next: (pack) => {
          this.selectedPackDetails = `Pack: ${pack.nom}`;
        },
        error: (error) => {
          console.error('Error fetching pack info:', error);
          this.selectedPackDetails = 'Pack details not available';
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReservation = undefined;
    this.selectedPackDetails = null;
  }

  goToAdd(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.showReservationTypePopup = true;
  }

  selectReservationType(type: TypeReservation): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const routes: { [key in TypeReservation]: string } = {
      [TypeReservation.LOGEMENT]: '/logementsFront',
      [TypeReservation.EVENT]: '/events/management',
      [TypeReservation.ACTIVITE]: '/activities',
      [TypeReservation.TRANSPORT]: '/',
      [TypeReservation.RESTAURANT]: '/restaurants',
      [TypeReservation.PACK]: '/packs/list-frontend'
    };

    this.router.navigate([routes[type]]);
    this.showReservationTypePopup = false;
  }

  closeReservationTypePopup(): void {
    this.showReservationTypePopup = false;
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

    if (confirm('Are you sure you want to cancel this reservation?')) {
      const reservation = this.reservations.find(r => r.id === id);
      if (!reservation) {
        alert('Reservation not found.');
        return;
      }

      // Remove localStorage entry for restaurant reservations
      if (reservation.typeres === TypeReservation.RESTAURANT) {
        localStorage.removeItem(`reservation_${id}`);
      }

      const updatedRes = { ...reservation, statut: StatutReservation.CANCELLED };
      this.reservationService.updateReservation(id, updatedRes).subscribe({
        next: () => {
          console.log(`Reservation ${id} updated to CANCELLED`);
          this.loadReservations();
          this.selectedReservation = undefined;
        },
        error: (error) => {
          console.error('Error updating reservation to CANCELLED:', error);
          alert('Failed to cancel reservation');
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
      error => {
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