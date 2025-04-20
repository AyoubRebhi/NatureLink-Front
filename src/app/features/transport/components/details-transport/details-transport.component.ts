import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportService } from '../../../../core/services/transport.service';
import { Transport } from '../../../../core/models/transport.model';

@Component({
  selector: 'app-details-transport',
  templateUrl: './details-transport.component.html',
  styleUrls: ['./details-transport.component.scss']
})
export class DetailsTransportComponent implements OnInit {
  transport!: Transport;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transportService: TransportService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    const parsedId = param ? Number(param) : NaN;

    if (isNaN(parsedId)) {
      console.error('Invalid transport ID');
      return;
    }

    this.id = parsedId;
    this.fetchTransport();
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
