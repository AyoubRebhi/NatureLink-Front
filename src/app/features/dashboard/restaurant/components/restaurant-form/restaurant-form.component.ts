import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestaurantService } from 'src/app/core/services/restaurant.service';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent implements OnInit {
  restaurantForm: FormGroup;
  selectedImage: File | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private router: Router
  ) {
    this.restaurantForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      localisation: ['', Validators.required],
      typeCuisine: ['', Validators.required],
      horairesOuverture: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Méthode pour gérer la sélection de l'image
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Méthode pour sauvegarder le restaurant
  saveRestaurant(): void {
    if (this.restaurantForm.invalid || !this.selectedImage) {
      this.errorMessage = 'Tous les champs sont obligatoires, y compris l’image.';
      return;
    }

    const formData = new FormData();
    // Ajouter tous les champs du formulaire dans FormData
    Object.keys(this.restaurantForm.controls).forEach(key => {
      formData.append(key, this.restaurantForm.get(key)?.value);
    });

    // Ajouter l'image au FormData, vérifier que selectedImage existe
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    } else {
      this.errorMessage = 'Veuillez sélectionner une image.';
      return;
    }

    // Appel au service pour ajouter le restaurant
    this.restaurantService.addRestaurant(formData).subscribe({
      next: () => {
        this.successMessage = 'Restaurant ajouté avec succès !';
        setTimeout(() => this.router.navigate(['/admin/restaurants']), 2000);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du restaurant:', error);
        this.errorMessage = "Erreur lors de l'ajout. Veuillez réessayer plus tard.";
      }
    });
  }

  // Méthode pour revenir à la page des restaurants
  goBack(): void {
    this.router.navigate(['/admin/restaurants']);
  }
}
