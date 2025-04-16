import { Component, OnInit } from '@angular/core';
import { MonumentService } from 'src/app/core/services/monument.service';
import { Monument } from 'src/app/core/models/monument';

@Component({
  selector: 'app-monument-list',
  templateUrl: './monument-list.component.html',
  styleUrls: ['./monument-list.component.scss']
})
export class MonumentListComponent implements OnInit {
  monuments: Monument[] = [];
  filteredRestaurants: Monument[] = [];
  searchTerm: string = '';
  errorMessage: string = '';

  constructor(private monumentService: MonumentService) {}

  ngOnInit(): void {
    this.loadMonuments();
  }

  loadMonuments(): void {
    this.monumentService.getAllMonuments().subscribe({
      next: (data) => {
        this.monuments = data;
        this.filterRestaurants(); // pour initialiser la liste filtrée
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des monuments.";
        console.error(err);
      }
    });
  }

  filterRestaurants(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRestaurants = this.monuments.filter(monument =>
      monument.nom.toLowerCase().includes(term) ||
      monument.description.toLowerCase().includes(term) ||
      monument.localisation.toLowerCase().includes(term)
    );
  }

  deleteMonument(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce monument ?')) {
      this.monumentService.deleteMonument(id).subscribe({
        next: () => {
          this.loadMonuments();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du monument', err);
        }
      });
    }
  }
}
