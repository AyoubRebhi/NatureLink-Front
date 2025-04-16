import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Guide } from 'src/app/core/models/guide';
import { Monument } from 'src/app/core/models/monument';
import { MonumentService } from 'src/app/core/services/monument.service';
import { VisitService } from 'src/app/core/services/visit.service';
import { GuideService } from 'src/app/core/services/guide.service'; // Ajout de l'import manquant

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: []
})
export class VisitFormComponent implements OnInit {
  visitForm: FormGroup;
  monuments: Monument[] = [];
  guides: Guide[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private monumentService: MonumentService,
    private guideService: GuideService, // Correction du nom (minuscule)
    private router: Router
  ) {
    this.visitForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required],
      monumentId: ['', Validators.required],
      guideId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMonuments();
    this.loadGuides();
  }

  loadMonuments(): void {
    this.isLoading = true;
    this.monumentService.getAllMonuments().subscribe({
      next: (monuments) => {
        this.monuments = monuments;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des monuments';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadGuides(): void {
    this.isLoading = true;
    this.guideService.getAllGuides().subscribe({ // Correction: guideService au lieu de GuideService
      next: (guides) => {
        this.guides = guides;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des guides';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.visitForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const visitData = {
      ...this.visitForm.value,
      monument: { id: this.visitForm.value.monumentId },
      guide: { id: this.visitForm.value.guideId }
    };

    this.visitService.createVisit(visitData).subscribe({
      next: (createdVisit) => {
        this.isLoading = false;
        this.router.navigate(['/admin/visit']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la création de la visite';
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/visit']);
  }
}
