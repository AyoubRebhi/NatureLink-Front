import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/core/models/restaurant';
import { RestaurantService } from 'src/app/core/services/restaurant.service';

@Component({
  selector: 'app-resto-front',
  templateUrl: './resto-front.component.html',
  styleUrls: ['./resto-front.component.scss']
})
export class RestoFrontComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.isLoading = true;
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = [...this.restaurants];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des restaurants';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  filterRestaurants(): void {
    if (!this.searchTerm) {
      this.filteredRestaurants = [...this.restaurants];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredRestaurants = this.restaurants.filter(restaurant =>
      restaurant.nom.toLowerCase().includes(term) ||
      restaurant.typeCuisine.toLowerCase().includes(term) ||
      restaurant.localisation.toLowerCase().includes(term)
    );
  }

  getRestaurantImage(imagePath: string): string {
    if (!imagePath) return 'assets/images/default-restaurant.jpg';
    return `http://localhost:9000/${imagePath}`;
  }
}
