import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ClothingService } from '../../../core/services/clothing.service';
import { DestinationService } from '../../../core/services/destination.service';
import { Router } from '@angular/router';
import { Destination } from '../../../core/models/Destination.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-clothing',
  templateUrl: './add-clothing.component.html',
  styleUrls: ['./add-clothing.component.scss']
})
export class AddClothingComponent implements OnInit {
  errorMessage: string | null = null;
  successMessage: string | null = null;
onCancel() {
  this.router.navigate(['/admin/ClothingList']);
}
  clothingForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: SafeUrl | string = '';
  seasons = ['Printemps', 'Été', 'Automne', 'Hiver'];
  destinations: Destination[] = [];
  submitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clothingService: ClothingService,
    private destinationService: DestinationService,
    private router: Router,
    private sanitizer: DomSanitizer
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
        this.imagePreview = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.clothingForm.get('image')?.setErrors({ maxSize: true });
        this.imagePreview = '';
        return;
      }

      this.selectedFile = file;
      this.clothingForm.patchValue({ image: file });
      this.clothingForm.get('image')?.updateValueAndValidity();

      // Créer l'aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        setTimeout(() => this.router.navigate(['/admin/ClothingList']), 5000);

      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'ajout du vêtement';
        console.error('Erreur lors de l\'ajout du vêtement:', err);
        this.isLoading = false;
      }
    });
  }
  removeImage(): void {
    this.imagePreview = '';
    this.selectedFile = null;
    this.clothingForm.patchValue({ image: null });
    this.clothingForm.get('image')?.setErrors({ required: true });
    this.clothingForm.get('image')?.markAsTouched();
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