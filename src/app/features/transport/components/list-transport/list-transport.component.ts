import { Component, OnInit } from '@angular/core';
import { TransportService } from '../../../../core/services/transport.service';
import { Transport } from '../../../../core/models/transport.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-list-transport',
  templateUrl: './list-transport.component.html',
  styleUrls: ['./list-transport.component.scss']
})
export class ListTransportComponent implements OnInit {
  transports: Transport[] = [];
  filteredTransports: Transport[] = [];
  term: string = '';
  isAgenceUser: boolean = false;
  currentUserId: number | null = null;

  constructor(
    private transportService: TransportService, 
    private router: Router, 
    private authService: AuthService
  ) {
    this.isAgenceUser = this.authService.hasRole(Role.AGENCE);
    this.currentUserId = this.authService.currentUserValue?.id || null;
  }
  
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
        // Filter transports if user is AGENCE
        if (this.isAgenceUser && this.currentUserId) {
          this.transports = data.filter(transport => transport.agenceId === this.currentUserId);
        }
        this.filteredTransports = [...this.transports];
      },
      error: (err) => {
        console.error('Error fetching transports', err);
      }
    });
  }

  filterData(): void {
    const search = this.term.toLowerCase();
    this.filteredTransports = this.transports.filter(t =>
      t.type.toLowerCase().includes(search) ||
      t.capacity?.toString().includes(search) ||
      t.pricePerKm?.toString().includes(search)
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
