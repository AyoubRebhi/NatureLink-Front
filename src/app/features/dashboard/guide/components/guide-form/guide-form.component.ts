import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GuideService } from 'src/app/core/services/guide.service'; // Assurez-vous d'importer le bon service

@Component({
  selector: 'app-guide-form',
  templateUrl: './guide-form.component.html',
  styleUrls: ['./guide-form.component.scss']
})
export class GuideFormComponent {
  guideForm: FormGroup;  // Déclaration du FormGroup
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private guideService: GuideService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.guideForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  // Méthode pour enregistrer un guide
  saveGuide(): void {
    if (this.guideForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;  // Si le formulaire est invalide, on arrête l'envoi.
    }

    const newGuide = this.guideForm.value;

    this.guideService.createGuide(newGuide).subscribe({
      next: (response) => {
        this.successMessage = 'Guide ajouté avec succès!';
        setTimeout(() => this.router.navigate(['/admin/guides']), 2000);
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de l'ajout du guide. Veuillez réessayer.";
        console.error('Erreur côté serveur: ', err);
      }
    });
  }

  // Fonction pour revenir à la page précédente
  goBack(): void {
    this.router.navigate(['/admin/guides']);
  }
}
