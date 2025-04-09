import { Component, OnInit } from '@angular/core';
import { Clothing } from '../../../model/Clothing.model';
import { ClothingService } from '../../../services/clothing.service';
import { Router } from '@angular/router'; // Importez Router

@Component({
  selector: 'app-clothing-list',
  templateUrl: './clothing-list.component.html',
  styleUrls: ['./clothing-list.component.scss']
})
export class ClothingListComponent implements OnInit {
  clothingItems: Clothing[] = [];
  filteredItems: Clothing[] = [];
  isLoading = true;
  selectedSeason = 'all';

  constructor(
    private clothingService: ClothingService,
    private router: Router // Injectez Router
  ) { }

  ngOnInit(): void {
    this.loadClothingItems();
  }

  loadClothingItems(): void {
    this.isLoading = true;
    this.clothingService.getAllClothingItems().subscribe({
      next: (data) => {
        this.clothingItems = data;
        this.filteredItems = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des vêtements:', err);
        this.isLoading = false;
      }
    });
  }

  deleteClothing(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vêtement ?')) {
      this.clothingService.deleteClothing(id).subscribe({
        next: () => {
          this.clothingItems = this.clothingItems.filter(item => item.id !== id);
          this.filterBySeason();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
        }
      });
    }
  }

  filterBySeason(): void {
    if (this.selectedSeason === 'all') {
      this.filteredItems = [...this.clothingItems];
    } else {
      this.filteredItems = this.clothingItems.filter(
        item => item.season === this.selectedSeason
      );
    }
  }

  // Nouvelle méthode pour naviguer vers la page de mise à jour
  navigateToUpdate(id: number): void {
    this.router.navigate(['/admin/ClothingUpdate/', id]);
  }
}