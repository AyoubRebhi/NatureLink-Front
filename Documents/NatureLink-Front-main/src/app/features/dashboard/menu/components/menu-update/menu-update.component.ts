import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/core/models/menu';

@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})
export class MenuUpdateComponent implements OnInit {
  menuForm!: FormGroup;
  restaurantId!: number;
  menuId!: number;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const restaurantIdParam = params.get('restaurantId');
      const menuIdParam = params.get('menuId');

      if (restaurantIdParam && menuIdParam) {
        this.restaurantId = +restaurantIdParam;
        this.menuId = +menuIdParam;
        this.loadMenu();
      } else {
        this.errorMessage = 'Identifiants manquants dans l’URL.';
      }
    });

    this.menuForm = this.fb.group({
      plats: ['', Validators.required],
      prixMoyen: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadMenu(): void {
    this.isLoading = true;
    this.menuService.getMenuById(this.restaurantId, this.menuId).subscribe({
      next: (menu) => {
        this.menuForm.patchValue(menu);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du menu';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.menuForm.invalid) return;

    this.isLoading = true;

    // Assurer que l'URL est correcte sans double "restaurants"
    this.menuService.updateMenu(this.restaurantId, this.menuId, this.menuForm.value).subscribe({
      next: () => {
        this.successMessage = 'Menu mis à jour avec succès !';
        this.router.navigate(['/admin/restaurants/details', this.restaurantId, 'menus']);
      },
      error: (err) => {
        this.errorMessage = `Échec de la mise à jour du menu: ${err.message}`;
        console.error(err);
        this.isLoading = false;
      }
    });
  }





  cancelUpdate(): void {
    this.router.navigate(['/admin/restaurants', this.restaurantId, 'menus']);
  }
}
