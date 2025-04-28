import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Visit } from 'src/app/core/models/visit';
import { VisitService } from 'src/app/core/services/visit.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss'],
  providers: [DatePipe]
})
export class VisitListComponent implements OnInit {
  visits: Visit[] = [];
  filteredVisits: Visit[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  private visitIdToDelete: number | null = null;

  constructor(
    private visitService: VisitService,
    private router: Router,
    private modalService: NgbModal,
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
        this.filteredVisits = data; // Initialize filteredVisits
        this.isLoading = false;
        console.log('Loaded visits:', this.visits); // Debug log
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.errorMessage = 'Erreur lors du chargement des visites';
        this.isLoading = false;
      }
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredVisits = this.visits.filter(visit =>
      (visit.monument?.name?.toLowerCase()?.includes(term) || false) ||
      (visit.guide.firstName?.toLowerCase()?.includes(term) || false) ||
      this.formatDate(visit.date).includes(term) ||
      (visit.time?.includes(term) || false)
    );
    console.log('Filtered visits:', this.filteredVisits); // Debug log
  }

  openDeleteModal(modal: any, id: number): void {
    this.visitIdToDelete = id;
    this.modalService.open(modal);
  }

  confirmDelete(): void {
    if (this.visitIdToDelete !== null) {
      this.isLoading = true;
      this.visitService.deleteVisit(this.visitIdToDelete).subscribe({
        next: () => {
          this.loadVisits();
          this.modalService.dismissAll();
          this.visitIdToDelete = null;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression de la visite';
          this.isLoading = false;
          console.error('Error deleting visit:', err);
          this.modalService.dismissAll();
        }
      });
    }
  }

  formatDateTime(date: string, time: string): string {
    return `${this.formatDate(date)} à ${time}`;
  }
}
