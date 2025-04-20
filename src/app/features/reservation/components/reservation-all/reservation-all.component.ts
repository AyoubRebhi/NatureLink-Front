import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/core/services/reservation.service';

@Component({
  selector: 'app-reservation-all',
  templateUrl: './reservation-all.component.html',
})
export class ReservationAllComponent implements OnInit {
  reservations: any[] = [];

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data.map((reservation, index) => ({
          ...reservation,
          num: index + 1, // Sequential numbering starting from 1
          username: reservation.clientNames?.[0] ?? 'N/A', // Display first username only
        }));
      },
      error: (err) => {
        console.error('Failed to load reservations', err);
      }
    });
  }
}
