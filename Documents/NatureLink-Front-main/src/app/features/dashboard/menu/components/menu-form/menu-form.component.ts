import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/core/models/menu';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit {
  menuForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  restaurantId!: number | null;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.menuForm = this.fb.group({
      plats: ['', [Validators.required, Validators.maxLength(100)]],
      prixMoyen: ['', [Validators.required, Validators.min(0), Validators.max(1000)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['restaurantId']; // S'assurer que le paramètre est bien "restaurantId"
      console.log('ID du restaurant extrait:', id);

      if (!isNaN(id) && id > 0) {
        this.restaurantId = id;
      } else {
        this.restaurantId = null;
        this.errorMessage = "Restaurant non valide.";
        setTimeout(() => this.router.navigate(['/admin/restaurants']), 3000);
      }
    });
  }

  onSubmit(): void {
    if (this.menuForm.invalid) {
      this.markFormGroupTouched(this.menuForm);
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const newMenu: Menu = {
      ...this.menuForm.value,
      prixMoyen: parseFloat(this.menuForm.value.prixMoyen)
    };

    if (!this.restaurantId) {
      this.errorMessage = "Impossible d'ajouter un menu sans restaurant valide.";
      this.isLoading = false;
      return;
    }

    console.log("Envoi du menu au backend:", newMenu);

    this.menuService.createMenu(this.restaurantId, newMenu).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Menu créé avec succès!';
        this.menuForm.reset();
        setTimeout(() => {
          this.router.navigate(['/admin/restaurants/details', this.restaurantId, 'menus']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Une erreur est survenue lors de la création du menu.";
        console.error('Erreur:', err);
      }
    });
  }


  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    if (this.restaurantId !== null) {
      this.router.navigate(['/admin/restaurants/details', this.restaurantId, 'menus']);
    } else {
      this.router.navigate(['/admin/restaurants']);
    }
  }
}
