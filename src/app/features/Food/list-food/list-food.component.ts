import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../../core/services/food.service';
import { Food } from '../../../core/models/Food.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-food',
  templateUrl: './list-food.component.html',
  styleUrls: ['./list-food.component.scss']
})
export class ListFoodComponent implements OnInit {
  foods: Food[] = [];
  filteredFoods: Food[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  searchTerm: string = '';
  error: string | null = null;

  constructor(
    private foodService: FoodService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.foodService.getAllFoods().subscribe({
      next: (foods) => {
        this.foods = foods;
        this.filteredFoods = [...foods];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load foods. Please try again later.';
        this.isLoading = false;
        console.error('Error loading foods:', err);
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredFoods = [...this.foods];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredFoods = this.foods.filter(food => 
      food.nom.toLowerCase().includes(term) || 
      food.description.toLowerCase().includes(term) ||
      food.season.toLowerCase().includes(term)
    );
  }

  navigateToAdd(): void {
    this.router.navigate(['/admin/FoodAdd']);
  }

  // Nouvelle méthode pour naviguer vers la page de mise à jour
  navigateToUpdate(id: number): void {
    this.router.navigate(['/admin/FoodUpdate/', id]);
  }

  deleteFood(id: number): void {
    if (confirm('Are you sure you want to delete this food item?')) {
      this.foodService.deleteFood(id).subscribe({
        next: () => {
          this.foods = this.foods.filter(food => food.id !== id);
          this.filteredFoods = this.filteredFoods.filter(food => food.id !== id);
        },
        error: (err) => {
          console.error('Error deleting food:', err);
          this.errorMessage = 'Failed to delete food item.';
        }
      });
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/FoodUpdate/', id]);
  }
}