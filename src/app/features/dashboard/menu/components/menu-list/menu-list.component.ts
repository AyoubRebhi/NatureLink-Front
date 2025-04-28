import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/core/models/menu';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuAllergenChatbotComponent } from 'src/app/features/dashboard/menu/menu-allergen-chatbot/menu-allergen-chatbot.component';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  menus: Menu[] = [];
  filteredMenus: Menu[] = [];
  specialMenus: Menu[] = [];
  restaurantId: number;
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm = '';
  menuIdToDelete: number | null = null;
  isFiltered = false;

  constructor(
    public menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.restaurantId = +this.route.snapshot.paramMap.get('restaurantId')! || 0;
  }

  ngOnInit(): void {
    if (this.restaurantId <= 0) {
      this.errorMessage = 'Identifiant de restaurant invalide';
      this.isLoading = false;
      return;
    }
    console.log('Restaurant ID:', this.restaurantId);
    this.loadMenus();
    this.loadSpecialMenus();
  }

  loadMenus(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.menuService.getMenusByRestaurant(this.restaurantId).subscribe({
      next: (data) => {
        this.menus = data;
        this.filteredMenus = [...data];
        this.isLoading = false;
        this.isFiltered = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des menus : ' + error.message;
        this.isLoading = false;
      }
    });
  }

  loadSpecialMenus(): void {
    // Placeholder: Replace with actual logic to fetch special/popular menus
    // For now, assume the first 3 menus are "special" for demonstration
    this.menuService.getMenusByRestaurant(this.restaurantId).subscribe({
      next: (data) => {
        this.specialMenus = data.slice(0, 3); // Example: Take first 3 menus
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des menus spéciaux : ', error);
      }
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm) {
      this.filteredMenus = [...this.menus];
      this.isFiltered = false;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredMenus = this.menus.filter(menu =>
      menu.plats.toLowerCase().includes(term) ||
      (menu.ingredientsDetails?.toLowerCase().includes(term) ?? false)
    );
    this.isFiltered = true;
  }

  openDeleteModal(content: TemplateRef<any>, menuId: number): void {
    this.menuIdToDelete = menuId;
    this.modalService.open(content);
  }

  confirmDelete(): void {
    if (this.menuIdToDelete !== null) {
      this.menuService.deleteMenu(this.menuIdToDelete).subscribe({
        next: () => {
          this.menus = this.menus.filter(m => m.id !== this.menuIdToDelete);
          this.filteredMenus = this.filteredMenus.filter(m => m.id !== this.menuIdToDelete);
          this.specialMenus = this.specialMenus.filter(m => m.id !== this.menuIdToDelete);
          this.menuIdToDelete = null;
          this.modalService.dismissAll();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du menu : ' + error.message;
          this.modalService.dismissAll();
        }
      });
    }
  }

  openAllergenChatbot(): void {
    const modalRef = this.modalService.open(MenuAllergenChatbotComponent, { size: 'lg' });
    modalRef.componentInstance.restaurantId = this.restaurantId;
    modalRef.componentInstance.filteredMenus.subscribe((filteredMenus: Menu[]) => {
      this.filteredMenus = filteredMenus;
      this.isFiltered = filteredMenus.length !== this.menus.length;
    });
  }

  resetFilter(): void {
    this.filteredMenus = [...this.menus];
    this.isFiltered = false;
    this.searchTerm = '';
  }

  navigateToAddMenu(): void {
    this.router.navigate([`/admin/restaurants/details/${this.restaurantId}/menus/new`]);
  }

  navigateToEditMenu(menuId: number): void {
    this.router.navigate([`/admin/restaurants/details/${this.restaurantId}/menus/${menuId}/edit`]);
  }

  getImage(filename: string | undefined): string {
    console.log();
    return filename ? this.menuService.getImage(filename) : 'assets/images/default-menu.jpg';
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-menu.jpg';
  }
}
