import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { TypeReservation } from 'src/app/core/models/type-reservation.model';
import { trigger, transition, style, animate, state } from '@angular/animations';

// Step 1: Enhanced TypeReservation enum with PACK


@Component({
  selector: 'app-reservation-all',
  templateUrl: './reservation-all.component.html',
  styleUrls: ['./reservation-all.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('300ms cubic-bezier(0.33, 1, 0.68, 1)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.33, 0, 0.68, 0)', 
          style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }))
      ])
    ]),
    trigger('segmentAnimation', [
      state('void', style({ transform: 'scale(0)' })),
      transition('void => *', [
        animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ transform: 'scale(1)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms 200ms ease-out', 
          style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ReservationAllComponent implements OnInit {
  // Step 2: Component Properties
  reservations: any[] = [];
  filteredReservations: any[] = [];
  pagedReservations: any[] = [];
  searchQuery: string = '';
  selectedType: TypeReservation | '' = '';
  typeReservations = Object.values(TypeReservation);
  
  // Stats modal variables
  showStatsPopup: boolean = false;
  typeDistribution: any[] = [];
  activeSegment: any = null;
  hoverState: 'none' | 'segment' | 'legend' = 'none';
  animationState = 'initial';

  // Step 3: Enhanced Chart Configuration
  chartConfig = {
    type: 'donut', // 'pie' or 'donut'
    donutWidth: 35, // Width of donut hole (percentage)
    showLabels: true,
    showTooltips: true,
    animate: true,
    duration: 1000
  };

  // Enhanced color palette with hover states
  colorPalette = [
    { background: '#4E79A7', hover: '#3A5F8A', text: '#FFFFFF' },
    { background: '#F28E2B', hover: '#DA7B1E', text: '#FFFFFF' },
    { background: '#E15759', hover: '#C94547', text: '#FFFFFF' },
    { background: '#76B7B2', hover: '#5EA09B', text: '#FFFFFF' },
    { background: '#59A14F', hover: '#478A3D', text: '#FFFFFF' },
    { background: '#EDC948', hover: '#D5B53A', text: '#000000' },
    { background: '#B07AA1', hover: '#98648A', text: '#FFFFFF' },
    { background: '#FF9DA7', hover: '#E7858F', text: '#000000' }
  ];

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 1;
  maxVisiblePages: number = 5;

  constructor(private reservationService: ReservationService) {}

  // Step 4: Initialize Component
  ngOnInit(): void {
    this.loadReservations();
  }

  // Step 5: Load Reservations
  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data.map((reservation, index) => ({
          ...reservation,
          num: index + 1,
          username: reservation.clientNames?.[0] ?? 'N/A',
        }));
        this.filteredReservations = [...this.reservations];
        this.calculateTypeDistribution();
        this.updatePagination();
      },
      error: (err) => {
        console.error('Failed to load reservations', err);
      },
    });
  }

  // Step 6: Filter Reservations
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
    
    // Add this to properly recalculate angles
    this.calculateTypeDistribution();
    this.currentPage = 1;
    this.updatePagination();
    
    // Force a chart redraw
    setTimeout(() => {
      this.animationState = 'initial';
      setTimeout(() => this.animationState = 'calculated', 50);
    });
  }

  // Step 7: Enhanced Type Detection with PACK
  getReservationType(reservation: any): TypeReservation | string {
    if (reservation.activityId) return TypeReservation.ACTIVITE;
    if (reservation.transportId) return TypeReservation.TRANSPORT;
    if (reservation.logementId) return TypeReservation.LOGEMENT;
    if (reservation.restaurantId) return TypeReservation.RESTAURANT;
    if (reservation.eventId) return TypeReservation.EVENT;
    if (reservation.packId) return TypeReservation.PACK;
    return 'Unknown';
  }
  trackBySegment(index: number, segment: any): string {
    return segment.type + index;
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'confirmed';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return 'unknown';
    }
  }

  // Step 8: Delete Reservation
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
          this.calculateTypeDistribution();
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

  // Step 9: Stats Modal Methods
  toggleStatsPopup(): void {
    this.showStatsPopup = !this.showStatsPopup;
    if (this.showStatsPopup) {
      this.calculateTypeDistribution();
    }
  }

  // Step 10: Enhanced Type Distribution Calculation
  calculateTypeDistribution(): void {
    const typeCounts = new Map<string, {count: number, color: any}>();
    
    // Initialize with all possible types and colors
    this.typeReservations.forEach((type, index) => {
      typeCounts.set(type, {
        count: 0,
        color: this.colorPalette[index % this.colorPalette.length]
      });
    });
    
    // Count actual occurrences
    this.filteredReservations.forEach(reservation => {
      const type = this.getReservationType(reservation);
      if (typeCounts.has(type)) {
        typeCounts.get(type)!.count++;
      }
    });
    
    // Convert to array and calculate metrics
    const total = this.filteredReservations.length;
    let cumulativeAngle = 0;
    
    this.typeDistribution = Array.from(typeCounts.entries())
      .filter(([_, data]) => data.count > 0) // Only show types with data
      .map(([type, data], index) => {
        const percentage = total > 0 ? (data.count / total) * 100 : 0;
        const roundedPercentage = Math.round(percentage * 10) / 10;
        const angle = (percentage / 100) * 360;
        
        return {
          type,
          count: data.count,
          percentage: roundedPercentage,
          angle,
          startAngle: cumulativeAngle,
          color: data.color,
          index,
          hovered: false,
          tooltipVisible: false
        };
        
        cumulativeAngle += angle;
      })
      .sort((a, b) => b.percentage - a.percentage);

    this.animationState = 'calculated';
  }

  // Step 11: Enhanced Segment Hover with Tooltips
  onSegmentHover(segment: any, isHovering: boolean): void {
    this.activeSegment = isHovering ? segment : null;
    this.hoverState = isHovering ? 'segment' : 'none';
    segment.hovered = isHovering;
    
    if (this.chartConfig.showTooltips) {
      segment.tooltipVisible = isHovering;
    }
  }

  // Step 12: Enhanced Legend Interaction
  onLegendHover(segment: any, isHovering: boolean): void {
    this.activeSegment = isHovering ? segment : null;
    this.hoverState = isHovering ? 'legend' : 'none';
    
    if (isHovering) {
      this.typeDistribution.forEach(s => {
        s.hovered = s.index === segment.index;
      });
    }
  }

  // Step 13: Toggle Chart Type
  toggleChartType(): void {
    this.chartConfig.type = this.chartConfig.type === 'pie' ? 'donut' : 'pie';
  }

  // Step 14: Pagination Methods (remain unchanged from your original code)
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

  // Step 15: Export to CSV (remain unchanged from your original code)
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
  // In your component class
closeModal(event?: Event) {
  if (event) {
    event.stopPropagation(); // Only stop propagation if event exists
  }
  this.showStatsPopup = false;
}
}