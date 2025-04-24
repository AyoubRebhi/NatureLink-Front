import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Monument } from 'src/app/core/models/monument';
import { MonumentService } from 'src/app/core/services/monument.service';


@Component({
  selector: 'app-monument-list',
  templateUrl: './monument-list.component.html',
  styleUrls: ['./monument-list.component.scss']
})
export class MonumentListComponent implements OnInit {
  monuments: Monument[] = [];
  filteredMonuments: Monument[] = [];
  searchTerm: string = '';
  errorMessage: string | null = null;
  isLoading = false;
  private monumentIdToDelete: number | null = null;

  constructor(
    private monumentService: MonumentService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadMonuments();
  }

  // Load all monuments
  loadMonuments(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.monumentService.getAllMonuments().subscribe({
      next: (data) => {
        this.monuments = data;
        this.filteredMonuments = data; // Initialize filtered list
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load monuments. Please try again.';
        this.isLoading = false;
        console.error('Error fetching monuments:', error);
      }
    });
  }

  // Filter monuments based on search term
  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMonuments = this.monuments.filter(monument =>
      monument.name?.toLowerCase().includes(term) ||
      monument.location?.toLowerCase().includes(term)
    );
  }

  // Open delete confirmation modal
  openDeleteModal(modal: TemplateRef<any>, id: number): void {
    this.monumentIdToDelete = id;
    this.modalService.open(modal, { ariaLabelledBy: 'modal-title' });
  }

  // Confirm deletion
  confirmDelete(): void {
    if (this.monumentIdToDelete !== null) {
      this.monumentService.deleteMonument(this.monumentIdToDelete).subscribe({
        next: () => {
          this.loadMonuments();
          this.monumentIdToDelete = null;
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete monument. Please try again.';
          console.error('Error deleting monument:', error);
        }
      });
    }
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default.jpg';
  }

  getImage(filename: string | undefined): string {
    return filename ? this.monumentService.getImage(filename) : 'assets/images/default.jpg';
  }
}
