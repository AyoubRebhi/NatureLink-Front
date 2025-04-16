import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Monument } from 'src/app/core/models/monument';  // Assurez-vous d'importer le bon modèle
import { MonumentService } from 'src/app/core/services/monument.service';  // Assurez-vous que le service est bien importé

@Component({
  selector: 'app-monument-form',
  templateUrl: './monument-form.component.html',
  styleUrls: ['./monument-form.component.scss']
})
export class MonumentFormComponent {
  monumentForm: FormGroup;  // Déclaration du FormGroup
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private monumentService: MonumentService,
    private router: Router,
    private fb: FormBuilder  // Injection de FormBuilder pour créer le formulaire
  ) {
    // Initialisation du formulaire dans le constructeur
    this.monumentForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
      localisation: ['', [Validators.required]],
      horairesOuverture: ['', [Validators.required]],
      prixEntree: ['', [Validators.required]],
      image: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  // Méthode pour enregistrer un monument
  saveMonument(): void {
    if (this.monumentForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;  // Si le formulaire est invalide, on arrête l'envoi.
    }

    const newMonument: Monument = this.monumentForm.value;  // Remplacez Restaurant par Monument

    this.monumentService.createMonument(newMonument).subscribe({
      next: (response) => {
        this.successMessage = 'Monument ajouté avec succès!';
        setTimeout(() => this.router.navigate(['/admin/monument']), 2000);
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de l'ajout du monument. Veuillez réessayer.";
        console.error('Erreur côté serveur: ', err);
        if (err.error) {
          console.error('Message d\'erreur complet:', err.error);
        }
      }
    });
  }

  // Fonction pour revenir à la page précédente
  goBack(): void {
    this.router.navigate(['/admin/monument']);
  }
}
