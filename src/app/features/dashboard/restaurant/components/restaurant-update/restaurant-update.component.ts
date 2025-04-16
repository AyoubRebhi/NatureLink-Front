import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Restaurant } from 'src/app/core/models/restaurant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestaurantService } from 'src/app/core/services/restaurant.service';

@Component({
  selector: 'app-restaurant-update',
  templateUrl: './restaurant-update.component.html',
  styleUrls: ['./restaurant-update.component.scss']
})
export class RestaurantUpdateComponent implements OnInit {
  restaurantForm: FormGroup;
  restaurantId: number | undefined;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.restaurantForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
      localisation: ['', [Validators.required]],
      typeCuisine: ['', [Validators.required]],
      horairesOuverture: ['', [Validators.required]],
      image: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID du restaurant depuis l'URL
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.restaurantId) {
      // Charger le restaurant existant pour modifier ses données
      this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
        next: (restaurant) => {
          this.restaurantForm.patchValue(restaurant);  // Remplir le formulaire avec les données du restaurant
        },
        error: (err) => {
          this.errorMessage = "Erreur lors du chargement du restaurant.";
          console.error(err);
        }
      });
    }
  }

  // Méthode pour mettre à jour un restaurant
  updateRestaurant(): void {
    if (this.restaurantForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    if (this.restaurantId !== undefined) {
      this.restaurantService.updateRestaurant(this.restaurantId, this.restaurantForm.value).subscribe({
        next: () => {
          this.successMessage = 'Restaurant mis à jour avec succès!';
          setTimeout(() => this.router.navigate(['/admin/restaurants']), 2000);
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de la mise à jour du restaurant.";
          console.error(err);
        }
      });
    }
  }

  // Retour à la liste des restaurants
  goBack(): void {
    this.router.navigate(['/admin/restaurants']);
  }
}
