import { Component, OnInit } from '@angular/core';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { Restaurant } from 'src/app/core/models/restaurant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  isLoading = true;
  searchTerm = '';

  constructor(public restaurantService: RestaurantService, private router: Router) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.isLoading = true;
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading restaurants', error);
        this.isLoading = false;
      }
    });
  }

  get filteredRestaurants(): Restaurant[] {
    return this.restaurants.filter(restaurant =>
      restaurant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      restaurant.typeCuisine.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Méthode de modification (redirection vers un formulaire de modification)
  update(id: number): void {
    this.router.navigate(['/admin/dashboard/restaurants', id]);
  }

  // Méthode de suppression
  deleteRestaurant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
      this.restaurantService.deleteRestaurant(id).subscribe({
        next: () => {
          this.restaurants = this.restaurants.filter(restaurant => restaurant.id !== id);
          console.log('Restaurant supprimé');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du restaurant', error);
        }
      });
    }
  }

  // Gérer les erreurs d'image
  onImageError(event: any): void {
    event.target.src = 'assets/images/default.jpg'; // Change l'attribut src de l'image en cas d'erreur
  }
}
