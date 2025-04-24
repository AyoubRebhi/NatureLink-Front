import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html'
})
export class MenuFormComponent implements OnInit {
  menuForm!: FormGroup;
  selectedImage?: File;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  isEditMode: boolean = false;
  restaurantId!: number;
  menuId?: number;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      plats: ['', [Validators.required, Validators.maxLength(100)]],
      prixMoyen: ['', [Validators.required, Validators.min(0)]],
      ingredientsDetails: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.route.params.subscribe(params => {
      this.restaurantId = +params['restaurantId'];
      if (params['menuId']) {
        this.isEditMode = true;
        this.menuId = +params['menuId'];
        this.loadMenu();
      }
    });
  }

  loadMenu(): void {
    if (this.menuId && this.restaurantId) {
      this.menuService.getMenuById(this.restaurantId, this.menuId).subscribe({
        next: (menu) => {
          this.menuForm.patchValue({
            plats: menu.plats,
            prixMoyen: menu.prixMoyen,
            ingredientsDetails: menu.ingredientsDetails
          });
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement du menu : ' + error.message;
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
    } else {
      this.selectedImage = undefined;
    }
  }

  onSubmit(): void {
    if (this.menuForm.invalid || (!this.selectedImage && !this.isEditMode)) {
      this.menuForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires, y compris l\'image.';
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    const request = this.isEditMode && this.menuId
      ? this.menuService.updateMenu(this.menuId, formData)
      : this.menuService.createMenu(this.restaurantId, formData);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Menu modifié avec succès.' : 'Menu ajouté avec succès.';
        this.errorMessage = '';
        this.isLoading = false;
        setTimeout(() => this.router.navigate([`/admin/restaurants/details/${this.restaurantId}/menus`]), 1500);
      },
      error: (error) => {
        this.errorMessage = `Erreur lors de ${this.isEditMode ? 'la modification' : 'l\'ajout'} du menu : ${error.message}`;
        this.successMessage = '';
        this.isLoading = false;
      }
    });
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    Object.keys(this.menuForm.value).forEach(key => {
      if (this.menuForm.value[key] !== null) {
        formData.append(key, this.menuForm.value[key].toString());
      }
    });
    if (this.selectedImage) {
      console.log(this.selectedImage.name);
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }
    return formData;
  }

  goBack(): void {
    this.router.navigate([`/admin/restaurants/details/${this.restaurantId}/menus`]);
  }
}
