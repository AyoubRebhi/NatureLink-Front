import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MonumentService } from 'src/app/core/services/monument.service';
import { Monument } from 'src/app/core/models/monument';

@Component({
  selector: 'app-monument-update',
  templateUrl: './monument-update.component.html',
  styleUrls: ['./monument-update.component.scss']
})
export class MonumentUpdateComponent implements OnInit {
  monumentForm: FormGroup;
  monumentId!: number;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private monumentService: MonumentService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.monumentForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      localisation: ['', Validators.required],
      horairesOuverture: ['', Validators.required],
      prixEntree: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.monumentId = Number(this.route.snapshot.paramMap.get('id'));

    this.monumentService.getMonumentById(this.monumentId).subscribe({
      next: (monument: Monument) => {
        this.monumentForm.patchValue(monument);
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement du monument.";
        console.error(err);
      }
    });
  }

  updateMonument(): void {
    if (this.monumentForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    this.monumentService.updateMonument(this.monumentId, this.monumentForm.value).subscribe({
      next: () => {
        this.successMessage = 'Monument mis à jour avec succès !';
        setTimeout(() => this.router.navigate(['/admin/monument']), 2000);
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de la mise à jour du monument.";
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/monument']);
  }
}
