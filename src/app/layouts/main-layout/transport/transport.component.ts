// transport.component.ts
import { Component, OnInit } from '@angular/core';
import { Transport } from 'src/app/core/models/transport.model';
import { TransportService } from 'src/app/core/services/transport.service';
import { TransportRatingService } from 'src/app/core/services/transport-rating.service';
import { TransportRating } from 'src/app/core/models/transport-rating.model';
import { Router } from '@angular/router';

declare var bootstrap: any; // Required to use Bootstrap JS modal API

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {
  transports: Transport[] = [];
  filteredTransports: Transport[] = [];
  averageRatings: { [transportId: number]: number } = {};
  ratingCounts: { [transportId: number]: number } = {};

  searchTerm: string = '';
  capacityFilter: string = '';
  capacityOptions: number[] = [];

  selectedTransport: Transport | null = null;
  userRating: number = 0;
  userComment: string = '';

  constructor(
    private transportService: TransportService,
    private ratingService: TransportRatingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransports();
  }

  loadTransports(): void {
    this.transportService.getAllTransports().subscribe({
      next: (data) => {
        // Filter out transports with undefined IDs as a precaution
        this.transports = data.filter(t => t.id !== undefined);
        this.filteredTransports = [...this.transports];
        this.capacityOptions = [...new Set(this.transports.map(t => t.capacity))].sort((a, b) => a - b);

        this.transports.forEach(t => {
          this.ratingService.getAverageRating(t.id!).subscribe(avg => {
            this.averageRatings[t.id!] = avg;
          });
          this.ratingService.getRatingsByTransportId(t.id!).subscribe(ratings => {
            this.ratingCounts[t.id!] = ratings.length;
          });
        });
      },
      error: (err) => {
        console.error('Failed to fetch transports:', err);
      }
    });
  }

  filterTransports(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTransports = this.transports.filter(t => {
      const matchesSearch = t.type.toLowerCase().includes(term) || t.capacity.toString().includes(term);
      const matchesCapacity = this.capacityFilter ? t.capacity.toString() === this.capacityFilter : true;
      return matchesSearch && matchesCapacity;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.capacityFilter = '';
    this.filteredTransports = [...this.transports];
  }

  openRatingModal(transport: Transport): void {
    this.selectedTransport = transport;
    this.userRating = 0;
    this.userComment = '';
    const modalElement = document.getElementById('ratingModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  setUserRating(value: number): void {
    this.userRating = value;
  }

  submitRating(): void {
    if (!this.selectedTransport || this.userRating === 0) return;

    const rating: TransportRating = {
      userId: 1, // Replace with actual user ID when auth is implemented
      rating: this.userRating,
      comment: this.userComment,
      transportId: this.selectedTransport.id
    };

    this.ratingService.addRating(rating).subscribe({
      next: () => {
        alert('Thank you for your feedback!');
        const modalElement = document.getElementById('ratingModal');
        if (modalElement) bootstrap.Modal.getInstance(modalElement)?.hide();
        this.loadTransports();
      },
      error: () => alert('Error submitting your rating')
    });
  }

  bookTransport(transportId: number): void {
    this.router.navigate(['/reservation/create'], {
      queryParams: { type: 'TRANSPORT', id: transportId }
    });
  }
}