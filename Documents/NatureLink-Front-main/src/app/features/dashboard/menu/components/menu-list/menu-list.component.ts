import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/core/models/menu';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  onSearchChange(): void {

    console.log('Recherche en cours...', this.searchTerm);
  }
  menus: Menu[] = [];
  filteredMenus: Menu[] = [];
  isLoading = true;
  searchTerm = '';
  restaurantId!: number;
  errorMessage: string | null = null;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('restaurantId');
      if (id) {
        this.restaurantId = +id;
        this.loadMenus();
      } else {
        this.errorMessage = 'ID restaurant invalide';
      }
    });
  }

  loadMenus(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.menuService.getMenusByRestaurant(this.restaurantId).subscribe({
      next: (menus) => {
        console.log("Menus récupérés :", menus); // Vérifie si les données arrivent
        this.menus = menus || [];
        this.filteredMenus = [...this.menus];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Serveur indisponible. Veuillez réessayer plus tard.';
        console.error('Erreur API:', err);
        this.isLoading = false;
        this.menus = [];
        this.filteredMenus = [];
      }
    });
  }

  filterMenus(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredMenus = term
      ? this.menus.filter(menu =>
          menu.plats.toLowerCase().includes(term) ||
          menu.prixMoyen.toString().includes(term)
        )
      : [...this.menus];
  }

  deleteMenu(menuId: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce menu ?')) {
      this.isLoading = true;
      this.menuService.deleteMenu(this.restaurantId, menuId).subscribe({
        next: () => {
          this.menus = this.menus.filter(m => m.id !== menuId);
          this.filterMenus();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Échec de la suppression';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/admin/restaurants', this.restaurantId, 'menus', 'new']);
  }
//
navigateToEdit(menuId: number): void {
  this.router.navigate(['/admin/restaurants/details', this.restaurantId, 'menus', menuId, ':menuId/edit']);
}



  trackById(index: number, item: Menu): number {
    return item.id ?? 0;
  }
}
