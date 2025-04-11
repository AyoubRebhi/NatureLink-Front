import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ClothingService } from '../../../core/services/clothing.service';
import { DestinationService } from '../../../core/services/destination.service';
import { Router } from '@angular/router';
import { Destination } from '../../../core/models/Destination.model';

@Component({
  selector: 'app-add-clothing',
  templateUrl: './add-clothing.component.html',
  styleUrls: ['./add-clothing.component.scss']
})
export class AddClothingComponent implements OnInit {
  clothingForm: FormGroup;
  selectedFile: File | null = null;
  seasons = ['Printemps', 'Été', 'Automne', 'Hiver'];
  destinations: Destination[] = [];
  submitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clothingService: ClothingService,
    private destinationService: DestinationService,
    private router: Router
  ) {
    this.clothingForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      season: ['', [Validators.required]],
      destination: [null, [Validators.required]],
      image: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.isLoading = true;
    this.destinationService.getAllDestinations().subscribe({
      next: (destinations) => {
        this.destinations = destinations;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des destinations:', err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.match('image.*')) {
        this.clothingForm.get('image')?.setErrors({ invalidType: true });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.clothingForm.get('image')?.setErrors({ maxSize: true });
        return;
      }

      this.selectedFile = file;
      this.clothingForm.patchValue({ image: file });
      this.clothingForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.clothingForm.invalid || !this.selectedFile) {
      return;
    }

    const formData = {
      name: this.clothingForm.value.name,
      description: this.clothingForm.value.description,
      season: this.clothingForm.value.season,
      destinationId: this.clothingForm.value.destination?.id,
      image: this.selectedFile
    };

    this.isLoading = true;
    this.clothingService.addClothingWithImage(
      formData.name,
      formData.description,
      formData.season,
      formData.destinationId,
      formData.image
    ).subscribe({
      next: () => {
        this.router.navigate(['/admin/ClothingList']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du vêtement:', err);
        this.isLoading = false;
      }
    });
  }

  // Safe getters with proper typing
  get nameControl(): AbstractControl | null { return this.clothingForm.get('name'); }
  get descriptionControl(): AbstractControl | null { return this.clothingForm.get('description'); }
  get seasonControl(): AbstractControl | null { return this.clothingForm.get('season'); }
  get destinationControl(): AbstractControl | null { return this.clothingForm.get('destination'); }
  get imageControl(): AbstractControl | null { return this.clothingForm.get('image'); }

  // Helper method for error checking
  hasError(control: AbstractControl | null, errorType: string): boolean {
    return control ? !!control.errors && !!control.errors[errorType] : false;
  }
}