
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from 'src/app/core/services/restaurant.service';

@Component({
  selector: 'app-restaurant-update',
  templateUrl: './restaurant-update.component.html',
  styleUrls: ['./restaurant-update.component.scss']
})
export class RestaurantUpdateComponent implements OnInit {
  restaurantForm: FormGroup;
  restaurantId: number;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.restaurantForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      localisation: ['', Validators.required],
      typeCuisine: ['', Validators.required],
      horairesOuverture: ['', [Validators.required, this.timeRangeValidator]],
      capacite: ['', [Validators.required, Validators.min(1)]],
      image: ['']
    });

    this.restaurantId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadRestaurantData();
  }

  loadRestaurantData(): void {
    this.isLoading = true;
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (restaurant) => {
        this.restaurantForm.patchValue(restaurant);
        if (restaurant.image) {
          this.imagePreviewUrl = this.getImage(restaurant.image);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des données du restaurant';
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
    }
  }

  updateRestaurant(): void {
    if (this.restaurantForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    this.restaurantService.updateRestaurant(this.restaurantId, formData).subscribe({
      next: () => {
        this.successMessage = 'Restaurant mis à jour avec succès';
        this.errorMessage = null;
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/admin/restaurants']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour du restaurant';
        this.successMessage = null;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    Object.keys(this.restaurantForm.controls).forEach(key => {
      if (key !== 'image') {
        const value = this.restaurantForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    return formData;
  }

  getImage(filename: string): string {
    return this.restaurantService.getImage(filename);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.restaurantForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  markAllAsTouched(): void {
    Object.values(this.restaurantForm.controls).forEach(control => {
      control.markAsTouched();
    });
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

  goBack(): void {
    this.router.navigate(['/admin/restaurants']);
  }
}

