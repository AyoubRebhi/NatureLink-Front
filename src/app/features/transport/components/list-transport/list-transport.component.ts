import { Component, OnInit } from '@angular/core';
import { TransportService } from '../../../../core/services/transport.service';
import { Transport } from '../../../../core/models/transport.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-transport',
  templateUrl: './list-transport.component.html',
  styleUrls: ['./list-transport.component.scss']
})
export class ListTransportComponent implements OnInit {
  transports: Transport[] = [];
  filteredTransports: Transport[] = [];
  term: string = '';

  constructor(private transportService: TransportService, private router: Router) {}
  
  goToEditTransport(id: number): void {
    if (!id && id !== 0) {
      console.error('Invalid transport ID');
      return;
    }
    this.router.navigate(['/admin/transport/edit', id]);
  }
  
  
  ngOnInit(): void {
    this.getTransports();
  }

  getTransports(): void {
    this.transportService.getAllTransports().subscribe({
      next: (data) => {
        this.transports = data;
        this.filteredTransports = data;
      },
      error: (err) => {
        console.error('Error fetching transports', err);
      }
    });
  }
  filterData(): void {
    const search = this.term.toLowerCase();
    this.filteredTransports = this.transports.filter(t =>
      t.type.toLowerCase().includes(search)
      || t.capacity?.toString().includes(search)
      || t.pricePerKm?.toString().includes(search)
    );
  }

  deleteTransport(id: number): void {
    if (confirm('Are you sure you want to delete this transport?')) {
      this.transportService.deleteTransport(id).subscribe({
        next: () => {
          this.transports = this.transports.filter(t => t.id !== id);
          this.filterData(); // Reapply filter after deletion
        },
        error: (err) => {
          console.error('Error deleting transport', err);
        }
      });
    }
  }
}
