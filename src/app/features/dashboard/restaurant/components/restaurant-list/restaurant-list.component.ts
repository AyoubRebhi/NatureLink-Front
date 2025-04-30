import { Component, OnInit, TemplateRef } from '@angular/core';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { Restaurant } from 'src/app/core/models/restaurant';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  openRestaurants: Restaurant[] = [];
  isLoading = true;
  searchTerm = '';
  restaurantIdToDelete: number | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadCurrentlyOpen();
  }

  loadCurrentlyOpen(): void {
    this.restaurantService.getRestaurantsOpenNow().subscribe({
      next: (data) => {
        this.openRestaurants = data;
        console.log('Restaurants ouverts à l\'heure actuelle: ', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restaurants ouverts: ', err);
      }
    });
  }

  loadRestaurants(): void {
    this.isLoading = true;
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = [...this.restaurants];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des restaurants', error);
        this.isLoading = false;
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

  openDeleteModal(content: TemplateRef<any>, restaurantId: number): void {
    this.restaurantIdToDelete = restaurantId;
    this.modalService.open(content);
  }

  confirmDelete(): void {
    if (this.restaurantIdToDelete !== null) {
      this.restaurantService.deleteRestaurant(this.restaurantIdToDelete).subscribe({
        next: () => {
          this.restaurants = this.restaurants.filter(r => r.id !== this.restaurantIdToDelete);
          this.filteredRestaurants = this.filteredRestaurants.filter(r => r.id !== this.restaurantIdToDelete);
          this.openRestaurants = this.openRestaurants.filter(r => r.id !== this.restaurantIdToDelete);
          this.restaurantIdToDelete = null;
          this.modalService.dismissAll();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du restaurant:', err);
        }
      });
    }
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default.jpg';
  }

  getImage(filename: string | undefined): string {
    return filename ? this.restaurantService.getImage(filename) : 'assets/images/default.jpg';
  }
}

