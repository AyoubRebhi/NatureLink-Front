import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from 'src/app/core/services/restaurant.service';


@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent implements OnInit {
  restaurantForm: FormGroup;
  selectedImage: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';
  isLoading = false;
  showSuccessPopup = false;


  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private router: Router
  ) {
    this.restaurantForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ0-9 ]+$')]],
      description: ['', Validators.required],
      localisation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9, ]+$')]],
      typeCuisine: ['', Validators.required],
      horairesOuverture: ['', [Validators.required, this.timeRangeValidator]],
      capacite: ['', [Validators.required, Validators.min(1)]]
    });
  }


  ngOnInit(): void {}


  // Getter pour simplifier l'accès aux contrôles dans le template
  get f() {
    return this.restaurantForm.controls;
  }


  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }


  saveRestaurant(): void {
    if (this.restaurantForm.invalid || !this.selectedImage) {
      this.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires, y compris l\'image.';
      return;
    }


    this.isLoading = true;
    const formData = this.prepareFormData();


    this.restaurantService.createRestaurant(formData).subscribe({
      next: () => {
        this.showSuccessPopup = true;
        this.errorMessage = '';
        this.isLoading = false;


        setTimeout(() => {
          this.router.navigate(['/admin/restaurants']);
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'ajout du restaurant: ' + (err.message || 'Erreur inconnue');
        this.isLoading = false;
        console.error(err);
      }
    });
  }


  private prepareFormData(): FormData {
    const formData = new FormData();
    Object.keys(this.restaurantForm.controls).forEach(key => {
      const value = this.restaurantForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });


    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }


    return formData;
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
    const regex = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(timeRange)) {
      return { 'invalidFormat': true };
    }


    const [start, end] = timeRange.split('-');
    if (start >= end) {
      return { 'invalidTimeRange': true };
    }
    return null;
  }


  goBack(): void {
    this.router.navigate(['/admin/restaurants']);
  }
}






 










