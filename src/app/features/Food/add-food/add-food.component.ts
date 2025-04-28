import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FoodService } from '../../../core/services/food.service';
import { DestinationService } from '../../../core/services/destination.service';
import { Router } from '@angular/router';
import { Destination } from '../../../core/models/Destination.model';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.scss']
})
export class AddFoodComponent implements OnInit {
  foodForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  seasons = ['Printemps', 'Été', 'Automne', 'Hiver'];
  destinations: Destination[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  previewImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private destinationService: DestinationService,
    private router: Router
  ) {
    this.foodForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      season: ['', Validators.required],
      destination: [null, Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.destinationService.getAllDestinations().subscribe({
      next: (destinations) => {
        this.destinations = destinations;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des destinations:', err);
        this.errorMessage = 'Erreur lors du chargement des destinations';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewImageUrl = null;
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.foodForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const { name, description, season, destination } = this.foodForm.value;

    this.foodService.addFoodWithImage(
      name,
      description,
      season,
      destination.id,
      this.selectedFile
    ).subscribe({
      next: (food) => {
        this.successMessage = 'food added sucessufully';
        setTimeout(() => this.router.navigate(['/admin/FoodList']), 2000);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
        this.errorMessage = 'Erreur in adding';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.foodForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  navigateToFoods(): void {
    this.router.navigate(['/admin/FoodList']);
  }

  // Getters pour les contrôles du formulaire
  get nameControl(): AbstractControl | null { return this.foodForm.get('name'); }
  get descriptionControl(): AbstractControl | null { return this.foodForm.get('description'); }
  get seasonControl(): AbstractControl | null { return this.foodForm.get('season'); }
  get destinationControl(): AbstractControl | null { return this.foodForm.get('destination'); }
  get imageControl(): AbstractControl | null { return this.foodForm.get('image'); }
}