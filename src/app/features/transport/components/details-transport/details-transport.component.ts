import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportService } from '../../../../core/services/transport.service';
import { Transport } from '../../../../core/models/transport.model';
import { TransportRating } from '../../../../core/models/transport-rating.model';
import { TransportRatingService } from '../../../../core/services/transport-rating.service';

@Component({
  selector: 'app-details-transport',
  templateUrl: './details-transport.component.html',
  styleUrls: ['./details-transport.component.scss']
})
export class DetailsTransportComponent implements OnInit {
  transport!: Transport;
  id!: number;
  averageRating: number = 0;
  ratings: TransportRating[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transportService: TransportService,
    private ratingService: TransportRatingService
  ) { }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    const parsedId = param ? Number(param) : NaN;

    if (isNaN(parsedId)) {
      console.error('Invalid transport ID');
      return;
    }

    this.id = parsedId;
    this.fetchTransport();
    this.fetchRatings();
  }

  fetchTransport(): void {
    this.transportService.getTransportById(this.id).subscribe({
      next: (data) => {
        this.transport = data;
      },
      error: (err) => {
        console.error('Error loading transport details:', err);
        this.router.navigate(['/admin/transport']); // Fallback if not found
      }
    });
  }
  fetchRatings(): void {
    this.ratingService.getAverageRating(this.id).subscribe({
      next: (avg) => (this.averageRating = avg),
    });

    this.ratingService.getRatingsByTransportId(this.id).subscribe({
      next: (data) => (this.ratings = data),
    });
  }
  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
  deleteTransport(): void {
    if (confirm('Are you sure you want to delete this transport?')) {
      this.transportService.deleteTransport(this.id).subscribe({
        next: () => {
          alert('Transport deleted successfully.');
          this.router.navigate(['/admin/transport']);
        },
        error: (err) => {
          console.error('Error deleting transport:', err);
          alert('Failed to delete transport.');
        }
      });
    }
  }
}
