import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/core/services/menu.service';
import { Menu } from 'src/app/core/models/menu';


@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})
export class MenuUpdateComponent implements OnInit {
  menuForm: FormGroup;
  menuId: number;
  restaurantId: number;
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private menuService: MenuService
  ) {
    this.restaurantId = +this.route.snapshot.paramMap.get('restaurantId')!;
    this.menuId = +this.route.snapshot.paramMap.get('menuId')!;
    this.menuForm = this.formBuilder.group({
      plats: ['', [Validators.required, Validators.maxLength(100)]],
      prixMoyen: ['', [Validators.required, Validators.min(0)]],
      ingredientsDetails: ['', [Validators.required, Validators.maxLength(500)]],
      image: [null]
    });
  }


  ngOnInit(): void {
    if (this.menuId && this.restaurantId) {
      this.loadMenu();
    } else {
      this.errorMessage = 'Identifiant de menu ou restaurant invalide.';
    }
  }


  loadMenu(): void {
    this.isLoading = true;
    this.menuService.getMenuById(this.restaurantId, this.menuId).subscribe({
      next: (menu) => {
        this.menuForm.patchValue({
          plats: menu.plats,
          prixMoyen: menu.prixMoyen,
          ingredientsDetails: menu.ingredientsDetails
        });
        if (menu.image) {
          this.imagePreviewUrl = this.menuService.getImage(menu.image);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du menu: ' + err.message;
        console.error(err);
        this.isLoading = false;
      }
    });
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.menuForm.patchValue({ image: this.selectedFile });
    }
  }


  onSubmit(): void {
    if (this.menuForm.invalid) {
      this.markAllAsTouched();
      return;
    }


    this.isLoading = true;
    const formData = this.prepareFormData();


    this.menuService.updateMenu(this.menuId, formData).subscribe({
      next: () => {
        this.successMessage = 'Menu mis à jour avec succès.';
        this.errorMessage = '';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate([`/admin/restaurants/details/${this.restaurantId}/menus`]);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour du menu: ' + err.message;
        this.successMessage = '';
        this.isLoading = false;
        console.error(err);
      }
    });
  }


  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.menuForm.value;
    formData.append('plats', formValue.plats);
    formData.append('prixMoyen', formValue.prixMoyen.toString());
    formData.append('ingredientsDetails', formValue.ingredientsDetails);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    return formData;
  }


  isFieldInvalid(field: string): boolean {
    const control = this.menuForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }


  markAllAsTouched(): void {
    Object.values(this.menuForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }


  onCancel(): void {
    this.router.navigate([`/admin/restaurants/details/${this.restaurantId}/menus`]);
  }
}
