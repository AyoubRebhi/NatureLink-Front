import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MonumentService } from 'src/app/core/services/monument.service';




@Component({
  selector: 'app-monument-update',
  templateUrl: './monument-update.component.html',
  styleUrls: ['./monument-update.component.scss']
})
export class MonumentUpdateComponent implements OnInit {
  monumentForm: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  isSubmitting = false;
  isGeneratingDescription = false;
  monumentId: number | null = null;
showSuccessPopup = false;
  constructor(
    private fb: FormBuilder,
    private monumentService: MonumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.monumentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(4000)],
      location: ['', Validators.maxLength(255)],
      openingHours: ['', Validators.maxLength(100)],
      entranceFee: [null, [Validators.min(0)]]
    });
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.monumentId = +id;
      this.loadMonument();
    } else {
      this.errorMessage = 'Invalid monument ID';
      this.router.navigate(['/admin/monument']);
    }
  }


  // Load monument data
  loadMonument(): void {
    if (this.monumentId !== null) {
      this.monumentService.getMonumentById(this.monumentId).subscribe({
        next: (monument) => {
          this.monumentForm.patchValue({
            name: monument.name,
            description: monument.description || '',
            location: monument.location || '',
            openingHours: monument.openingHours || '',
            entranceFee: monument.entranceFee
          });
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to load monument';
        }
      });
    }
  }


  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Please upload a valid image file (JPEG, PNG, or GIF).';
        this.selectedFile = null;
        input.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'File size exceeds 10MB limit.';
        this.selectedFile = null;
        input.value = '';
        return;
      }
      this.selectedFile = file;
      this.errorMessage = null;
    }
  }


  // Generate description
  generateDescription(): void {
    const name = this.monumentForm.get('name')?.value;
    if (!name) {
      this.errorMessage = 'Please enter a monument name before generating a description.';
      return;
    }
    if (this.isGeneratingDescription) return;


    this.isGeneratingDescription = true;
    this.errorMessage = null;


    this.monumentService.enrichMonument(name).subscribe({
      next: (monument) => {
        this.monumentForm.patchValue({ description: monument.description });
        this.isGeneratingDescription = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to generate description. Please try again.';
        this.isGeneratingDescription = false;
      }
    });
  }


  // Handle form submission
  onSubmit(): void {
    if (this.monumentForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire avant de soumettre.';
      return;
    }


    if (this.isSubmitting || this.monumentId === null) return;


    this.isSubmitting = true;
    this.errorMessage = null;


    const formData = new FormData();
    formData.append('name', this.monumentForm.get('name')?.value);
    formData.append('description', this.monumentForm.get('description')?.value || '');
    formData.append('location', this.monumentForm.get('location')?.value || '');
    formData.append('openingHours', this.monumentForm.get('openingHours')?.value || '');


    const entranceFee = this.monumentForm.get('entranceFee')?.value;
    if (entranceFee !== null && entranceFee !== undefined) {
      formData.append('entranceFee', entranceFee.toString());
    }


    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }


    this.monumentService.updateMonument(this.monumentId, formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showSuccessPopup = true;


        // Redirection après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/admin/monument']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Échec de la mise à jour du monument. Veuillez réessayer.';
      }
    });
  }
}
