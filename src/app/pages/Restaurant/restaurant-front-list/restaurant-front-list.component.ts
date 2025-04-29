import { Component, OnInit } from '@angular/core';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { Restaurant } from 'src/app/core/models/restaurant';


@Component({
  selector: 'app-restaurant-front-list',
  templateUrl: './restaurant-front-list.component.html',
  styleUrls: ['./restaurant-front-list.component.scss']
})
export class RestaurantFrontListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  openRestaurants: Restaurant[] = [];
  isLoading = true;
  searchTerm = '';


  constructor(private restaurantService: RestaurantService) {}


  ngOnInit(): void {
    this.loadRestaurants();
    this.loadCurrentlyOpen();
  }


  loadRestaurants(): void {
    this.isLoading = true;
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading restaurants:', error);
        this.isLoading = false;
      }
    });
  }


  loadCurrentlyOpen(): void {
    this.restaurantService.getRestaurantsOpenNow().subscribe({
      next: (data) => {
        this.openRestaurants = data;
      },
      error: (err) => {
        console.error('Error loading open restaurants:', err);
      }
    });
  }


  onSearchChange(): void {
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


  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default.jpg';
  }


  getImage(filename: string | undefined): string {
    return filename ? this.restaurantService.getImage(filename) : 'assets/images/default.jpg';
  }
}
