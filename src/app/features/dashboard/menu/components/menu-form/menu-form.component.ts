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
  imagePreviewUrl?: string;
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
      plats: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      prixMoyen: ['', [Validators.required, Validators.min(0)]],
      ingredients: ['', [Validators.required, Validators.maxLength(500)]],  // Modifié ici
      description: ['', [Validators.maxLength(500)]]
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
            ingredients: menu.ingredientsDetails,  // Modifié ici
          });
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement du menu : ' + (error.message || 'Erreur inconnue');
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
      this.previewImage(this.selectedImage);
    } else {
      this.selectedImage = undefined;
      this.imagePreviewUrl = undefined;
    }
  }

  previewImage(image: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
    };
    reader.readAsDataURL(image);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.menuForm.get(fieldName);
    return (control?.invalid && (control?.touched || control?.dirty)) ?? false;
  }

  onSubmit(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const menuData = this.menuForm.value;

    // Ajouter les champs texte
    formData.append('plats', menuData.plats);
    formData.append('prixMoyen', menuData.prixMoyen.toString());
    formData.append('ingredientsDetails', menuData.ingredients); // Mapping ingredients -> ingredientsDetails
    if (menuData.description) {
      formData.append('description', menuData.description);
    }

    // Ajouter l'image si elle existe
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

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
        this.errorMessage = `Erreur lors de ${this.isEditMode ? 'la modification' : 'l\'ajout'} du menu : ${error.message || 'Erreur inconnue'}`;
        this.successMessage = '';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate([`/admin/restaurants/details/${this.restaurantId}/menus`]);
  }
}