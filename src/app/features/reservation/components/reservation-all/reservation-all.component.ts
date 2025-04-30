import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';

@Component({
  selector: 'app-reservation-all',
  templateUrl: './reservation-all.component.html',
  styleUrls: ['./reservation-all.component.scss'],
})
export class ReservationAllComponent implements OnInit {
  reservations: any[] = [];
  filteredReservations: any[] = [];
  pagedReservations: any[] = [];
  searchQuery: string = '';
  selectedType: TypeReservation | '' = '';
  typeReservations = Object.values(TypeReservation);
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 1;
  maxVisiblePages: number = 5;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data.map((reservation, index) => ({
          ...reservation,
          num: index + 1,
          username: reservation.clientNames?.[0] ?? 'N/A',
        }));
        this.filteredReservations = [...this.reservations];
        this.updatePagination();
      },
      error: (err) => {
        console.error('Failed to load reservations', err);
      },
    });
  }

  filterReservations(): void {
    this.filteredReservations = this.reservations.filter((reservation) => {
      const matchesSearch = this.searchQuery
        ? reservation.username.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesType = this.selectedType
        ? this.getReservationType(reservation) === this.selectedType
        : true;
      return matchesSearch && matchesType;
    });
    
    this.currentPage = 1;
    this.updatePagination();
  }

  getReservationType(reservation: any): TypeReservation | string {
    if (reservation.activityId) return TypeReservation.ACTIVITE;
    if (reservation.transportId) return TypeReservation.TRANSPORT;
    if (reservation.logementId) return TypeReservation.LOGEMENT;
    if (reservation.restaurantId) return TypeReservation.RESTAURANT;
    if (reservation.eventId) return TypeReservation.EVENT;
    if (reservation.packId) return TypeReservation.PACK;
    return 'Unknown';
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'confirmed';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'unknown';
    }
  }

  deleteReservation(id: number): void {
    if (id === undefined || id === null) {
      alert('Reservation ID is missing.');
      return;
    }
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.reservations = this.reservations.filter((r) => r.id !== id);
          this.filteredReservations = this.filteredReservations.filter((r) => r.id !== id);
          this.updatePagination();
          alert('Reservation deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting reservation:', err);
          alert('Failed to delete reservation.');
        },
      });
    }
  }

  exportToCSV(): void {
    const headers = [
      'Reservation #',
      'Username',
      'Start Date',
      'End Date',
      'Status',
      'Type',
      'Number of Rooms',
    ];
    const csvData = this.filteredReservations.map((reservation) => [
      reservation.num,
      reservation.username,
      reservation.dateDebut.toLocaleDateString(),
      reservation.dateFin.toLocaleDateString(),
      reservation.statut,
      this.getReservationType(reservation),
      reservation.logementId ? (reservation.numRooms ?? 'N/A') : 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReservations.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedReservations = this.filteredReservations.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  getDisplayedPages(): number[] {
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    let endPage = startPage + this.maxVisiblePages - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getFirstItemNumber(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getLastItemNumber(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredReservations.length);
  }
}