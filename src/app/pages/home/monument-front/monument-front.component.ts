import { Component } from '@angular/core';
import { Monument } from 'src/app/core/models/monument';
import { MonumentService } from 'src/app/core/services/monument.service';

@Component({
  selector: 'app-monument-front',
  templateUrl: './monument-front.component.html',
  styleUrls: ['./monument-front.component.scss']
})
export class MonumentFrontComponent {
  monuments: Monument[] = [];
  filteredMonuments: Monument[] = [];
  searchTerm = '';
  isLoading = true;
  isDeleting = false;
  errorMessage = '';

  constructor(private monumentService: MonumentService) {}

  ngOnInit(): void {
    this.loadMonuments();
  }

  loadMonuments(): void {
    this.isLoading = true;
    this.monumentService.getAllMonuments().subscribe({
      next: (data) => {
        this.monuments = data;
        this.filteredMonuments = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des monuments';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  filterMonuments(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMonuments = term
      ? this.monuments.filter(monument =>
          monument.nom.toLowerCase().includes(term) ||
          monument.description.toLowerCase().includes(term) ||
          monument.localisation.toLowerCase().includes(term)
        )
      : [...this.monuments];
  }

  deleteMonument(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce monument ?')) {
      this.isDeleting = true;
      this.monumentService.deleteMonument(id).subscribe({
        next: () => {
          this.loadMonuments();
          this.isDeleting = false;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.isDeleting = false;
        }
      });
    }
  }
}
