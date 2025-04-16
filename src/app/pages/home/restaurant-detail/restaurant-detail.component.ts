import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { Restaurant } from 'src/app/core/models/restaurant';
import { Menu } from 'src/app/core/models/menu';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss']
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant | null = null;
  menus: Menu[] = [];
  filteredMenus: Menu[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  activeTab: 'info' | 'menus' = 'info';
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRestaurant(+id);
      this.loadMenus(+id);
    } else {
      this.errorMessage = 'ID restaurant invalide';
      this.isLoading = false;
    }
  }

  loadRestaurant(id: number): void {
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (data) => {
        this.restaurant = data;
      },
      error: (error) => {
        console.error('Error loading restaurant', error);
        this.errorMessage = 'Erreur lors du chargement du restaurant';
        this.isLoading = false;
      }
    });
  }

  loadMenus(restaurantId: number): void {
    this.menuService.getMenusByRestaurant(restaurantId).subscribe({
      next: (menus) => {
        this.menus = menus || [];
        this.filteredMenus = [...this.menus];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading menus', error);
        this.errorMessage = 'Erreur lors du chargement des menus';
        this.isLoading = false;
      }
    });
  }

  getRestaurantImage(imagePath: string): string {
    return imagePath
      ? `http://localhost:9000/${imagePath}`
      : 'assets/images/default-restaurant.jpg';
  }

  setActiveTab(tab: 'info' | 'menus'): void {
    this.activeTab = tab;
  }

  getPlatsArray(platsString: string): string[] {
    return platsString.split(',').map(plat => plat.trim());
  }

  filterMenus(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredMenus = term
      ? this.menus.filter(menu =>
          menu.plats.toLowerCase().includes(term) ||
          menu.prixMoyen.toString().includes(term) // Conversion du nombre en string
        )
      : [...this.menus];
  }
}
