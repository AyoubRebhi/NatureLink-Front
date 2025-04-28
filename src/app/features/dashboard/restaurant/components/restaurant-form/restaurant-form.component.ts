
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from 'src/app/core/services/restaurant.service';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html'
})
export class RestaurantFormComponent implements OnInit {
  restaurantForm!: FormGroup;
  selectedImage?: File;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.restaurantForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      localisation: ['', Validators.required],
      typeCuisine: ['', Validators.required],
      horairesOuverture: ['', [Validators.required, this.timeRangeValidator]],
      capacite: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Méthode pour sélectionner une image
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
    }
  }

  // Méthode pour enregistrer le restaurant
  saveRestaurant(): void {
    // Validation des champs
    if (this.restaurantForm.invalid || !this.selectedImage) {
      this.restaurantForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires, y compris l\'image.';
      return;
    }

    // Continuer le traitement si le formulaire est valide
    this.isLoading = true;
    const formData = this.prepareFormData();

    this.restaurantService.createRestaurant(formData).subscribe({
      next: () => {
        this.successMessage = 'Restaurant ajouté avec succès.';
        this.errorMessage = '';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/admin/restaurants']), 1500);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'ajout du restaurant : ' + (error.message || 'Erreur inconnue');
        this.successMessage = '';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  // Préparation des données du formulaire pour l'envoi (FormData)
  private prepareFormData(): FormData {
    const formData = new FormData();

    // Ajout des champs du formulaire
    Object.keys(this.restaurantForm.value).forEach(key => {
      if (this.restaurantForm.value[key] !== null) {
        formData.append(key, this.restaurantForm.value[key].toString());
      }
    });

    // Ajout de l'image
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

    return formData;
  }

  // Méthode pour marquer tous les champs comme touchés afin de déclencher la validation
  markAllAsTouched(): void {
    this.restaurantForm.markAllAsTouched();
  }

  timeRangeValidator(control: FormControl): { [key: string]: boolean } | null {
    const timeRange = control.value;
    if (timeRange && timeRange.includes('-')) {
      const [start, end] = timeRange.split('-');
      if (start >= end) {
        return { 'invalidTimeRange': true };
      }
    }
    return null;
  }

  // Méthode pour revenir à la liste des restaurants
  goBack(): void {
    this.router.navigate(['/admin/restaurants']);
  }
}

