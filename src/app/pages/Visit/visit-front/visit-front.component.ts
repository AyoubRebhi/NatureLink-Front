import { Component, OnInit } from '@angular/core';
import { VisitService } from 'src/app/core/services/visit.service';
import { Visit } from 'src/app/core/models/visit';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visit-front',
  templateUrl: './visit-front.component.html',
  styleUrls: ['./visit-front.component.scss'],
  providers: [DatePipe]
})
export class VisitFrontComponent implements OnInit {
  visits: Visit[] = [];
  filteredVisits: Visit[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 8;
  sortField = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private visitService: VisitService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits(): void {
    this.isLoading = true;
    this.visitService.getAllVisits().subscribe({
      next: (data) => {
        this.visits = data;
        this.filteredVisits = [...data];
        this.sortVisits();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading visits. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }


  sortVisits(field: string = this.sortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredVisits.sort((a, b) => {
      let valueA: any = '';
      let valueB: any = '';

      switch (field) {
        case 'date':
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
          break;
        case 'monument':
          valueA = a.monument?.name?.toLowerCase() || '';
          valueB = b.monument?.name?.toLowerCase() || '';
          break;
        case 'guide':
          valueA = `${a.guide?.firstName?.toLowerCase()} ${a.guide?.lastName?.toLowerCase()}` || '';
          valueB = `${b.guide?.firstName?.toLowerCase()} ${b.guide?.lastName?.toLowerCase()}` || '';
          break;
        case 'time':
          valueA = a.time?.toLowerCase() || '';
          valueB = b.time?.toLowerCase() || '';
          break;
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'bi bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }

  viewDetails(): void {
    this.router.navigate(['/monuments']);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy') || '';
  }

  get paginatedVisits(): Visit[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVisits.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredVisits.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
