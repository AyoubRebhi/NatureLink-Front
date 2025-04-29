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
  monumentIdToDelete: number | null = null;


  private readonly DEFAULT_IMAGE = 'assets/images/default-monument.jpg';


  constructor(
    private monumentService: MonumentService,
    private modalService: NgbModal
  ) {}


  ngOnInit(): void {
    this.loadMonuments();
  }


  /** Load all monuments from the backend */
  loadMonuments(): void {
    this.isLoading = true;
    this.errorMessage = null;


    this.monumentService.getAllMonuments().subscribe({
      next: (data) => {
        this.monuments = data;
        this.filteredMonuments = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load monuments. Please try again.';
        this.isLoading = false;
        console.error('Error fetching monuments:', error);
      }
    });
  }


  /** Filter monuments based on search input */
  onSearchChange(): void {
    const term = this.searchTerm.trim().toLowerCase();


    this.filteredMonuments = this.monuments.filter(monument =>
      (monument.name && monument.name.toLowerCase().includes(term)) ||
      (monument.location && monument.location.toLowerCase().includes(term))
    );
  }


  /** Open delete confirmation modal */
  openDeleteModal(modal: TemplateRef<any>, id: number): void {
    this.monumentIdToDelete = id;
    this.modalService.open(modal, { ariaLabelledBy: 'modal-title' });
  }


  /** Confirm and delete the selected monument */
  confirmDelete(): void {
    if (this.monumentIdToDelete === null) return;


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


  /** Handle image loading error */
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.DEFAULT_IMAGE;
    imgElement.onerror = null;
  }


  /** Get the full image URL or a default fallback */
  getImageUrl(imageName?: string): string {
    return imageName ? this.monumentService.getImage(imageName) : this.DEFAULT_IMAGE;
  }
}
