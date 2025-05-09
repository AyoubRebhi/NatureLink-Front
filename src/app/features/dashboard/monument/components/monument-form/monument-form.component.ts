import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MonumentService } from 'src/app/core/services/monument.service';


@Component({
  selector: 'app-monument-form',
  templateUrl: './monument-form.component.html',
  styleUrls: ['./monument-form.component.scss']
})
export class MonumentFormComponent implements OnInit {
  monumentForm: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  isSubmitting = false;
  isGeneratingDescription = false;
  showSuccessPopup = false;


  constructor(
    private fb: FormBuilder,
    private monumentService: MonumentService,
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


  ngOnInit(): void {}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Veuillez sélectionner une image valide (JPEG, PNG ou GIF).';
        this.selectedFile = null;
        input.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'La taille du fichier dépasse la limite de 10 Mo.';
        this.selectedFile = null;
        input.value = '';
        return;
      }
      this.selectedFile = file;
      this.errorMessage = null;
    }
  }


  generateDescription(): void {
    const name = this.monumentForm.get('name')?.value;
    if (!name) {
      this.errorMessage = 'Veuillez saisir le nom du monument avant de générer une description.';
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
        this.errorMessage = err.error?.message || 'Échec de la génération de la description. Veuillez réessayer.';
        this.isGeneratingDescription = false;
      }
    });
  }


  onSubmit(): void {
    if (this.isSubmitting) return;


    this.isSubmitting = true; // blocage immédiat
    this.errorMessage = null;


    if (this.monumentForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire avant de soumettre.';
      this.isSubmitting = false;
      return;
    }


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


    this.monumentService.createMonument(formData).subscribe({
      next: () => {
        this.showSuccessPopup = true;
        this.monumentForm.reset(); // reset du formulaire
        this.selectedFile = null;


        setTimeout(() => {
          this.showSuccessPopup = false;
          this.router.navigate(['/admin/monument']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Échec de la création du monument. Veuillez réessayer.';
        this.isSubmitting = false; // important pour réactiver le bouton
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }




}


