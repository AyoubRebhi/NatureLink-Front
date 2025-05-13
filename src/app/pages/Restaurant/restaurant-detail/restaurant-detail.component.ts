import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { Restaurant } from 'src/app/core/models/restaurant';
import { Menu } from 'src/app/core/models/menu';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuAllergenChatbotComponent } from 'src/app/features/dashboard/menu/menu-allergen-chatbot/menu-allergen-chatbot.component';


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
  isFiltered = false;
  defaultImage = 'assets/images/default.jpg';


  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    public menuService: MenuService,
    private modalService: NgbModal
  ) {}


  ngOnInit(): void {
    const restaurantId = +this.route.snapshot.paramMap.get('id')!;
    this.loadRestaurant(restaurantId);
    this.loadMenus(restaurantId);
  }


  loadRestaurant(id: number): void {
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (data) => {
        this.restaurant = data;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load restaurant: ' + error.message;
        console.error('Error loading restaurant:', error);
      }
    });
  }


  loadMenus(restaurantId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.menuService.getMenusByRestaurant(restaurantId).subscribe({
      next: (data) => {
        this.menus = data;
        this.filteredMenus = [...data];
        this.isLoading = false;
        this.isFiltered = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load menus: ' + error.message;
        this.isLoading = false;
        console.error('Error loading menus:', error);
      }
    });
  }


  openAllergenChatbot(): void {
    const modalRef = this.modalService.open(MenuAllergenChatbotComponent, { size: 'lg' });
    modalRef.componentInstance.restaurantId = +this.route.snapshot.paramMap.get('id')!;
    modalRef.componentInstance.filteredMenus.subscribe((filteredMenus: Menu[]) => {
      this.filteredMenus = filteredMenus;
      this.isFiltered = filteredMenus.length !== this.menus.length;
    });
  }


  // Removed duplicate implementation of onImageError


  getImage(filename: string | undefined): string {
    return filename ? this.restaurantService.getImage(filename) : this.defaultImage;
  }
  getMenuImageUrl(filename: string | undefined): string {
    if (!filename) {
      return 'assets/images/default-menu.jpg';
    }


    // Vérifiez si l'URL contient déjà le chemin complet
    if (filename.startsWith('http')) {
      return filename;
    }


    // Retournez l'URL complète avec le chemin de base
    return `http://backend/picloud/uploads/images/${filename}`;
  }


  // Modifiez onImageError pour utiliser l'image par défaut
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-menu.jpg';
    imgElement.onerror = null; // Empêche les boucles d'erreur infinies
  }


}
