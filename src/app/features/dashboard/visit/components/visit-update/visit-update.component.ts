import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guide } from 'src/app/core/models/guide';
import { Monument } from 'src/app/core/models/monument';
import { GuideService } from 'src/app/core/services/guide.service';
import { MonumentService } from 'src/app/core/services/monument.service';
import { VisitService } from 'src/app/core/services/visit.service';
import { Visit } from 'src/app/core/models/visit';

@Component({
  selector: 'app-visit-update',
  templateUrl: './visit-update.component.html',
  styleUrls: ['./visit-update.component.scss']
})
export class VisitUpdateComponent implements OnInit {
  visitForm: FormGroup;
  visitId!: number;
  monuments: Monument[] = [];
  guides: Guide[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private monumentService: MonumentService,
    private guideService: GuideService,
    private route: ActivatedRoute,
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.router.navigate(['/visits']);
      return;
    }

    this.visitId = +idParam;
    this.loadVisitData();
    this.loadMonuments();
    this.loadGuides();
  }

  loadVisitData(): void {
    this.isLoading = true;
    this.visitService.getVisitById(this.visitId).subscribe({
      next: (visit: Visit) => {
        this.visitForm.patchValue({
          date: visit.date,
          time: visit.time,
          price: visit.price,
          duration: visit.duration,
          monumentId: visit.monument?.id,
          guideId: visit.guide?.id
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de la visite';
        this.isLoading = false;
        console.error(err);
        this.router.navigate(['/visit']);
      }
    });
  }

  loadMonuments(): void {
    this.isLoading = true;
    this.monumentService.getAllMonuments().subscribe({
      next: (monuments: Monument[]) => {
        this.monuments = monuments;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des monuments', err);
        this.isLoading = false;
      }
    });
  }

  loadGuides(): void {
    this.isLoading = true;
    this.guideService.getAllGuides().subscribe({
      next: (guides: Guide[]) => {
        this.guides = guides;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des guides', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.visitForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const monumentId = Number(this.visitForm.value.monumentId);
    const guideId = Number(this.visitForm.value.guideId);

    const selectedMonument = this.monuments.find(m => m.id === monumentId);
    const selectedGuide = this.guides.find(g => g.id === guideId);

    if (!selectedMonument || !selectedMonument.id || !selectedGuide || !selectedGuide.id) {
      this.errorMessage = 'Monument ou guide non trouvé';
      this.isLoading = false;
      return;
    }

    const visitData: Visit = {
      id: this.visitId,
      date: this.visitForm.value.date,
      time: this.visitForm.value.time,
      price: this.visitForm.value.price,
      duration: this.visitForm.value.duration,
      monument: {
        id: selectedMonument.id,
        nom: selectedMonument.nom
      },
      guide: {
        id: selectedGuide.id,
        firstName: selectedGuide.firstName,
        lastName: selectedGuide.lastName
      },
      nomMonument: selectedMonument.nom,
      nomGuide: `${selectedGuide.firstName} ${selectedGuide.lastName}`
    };

    this.visitService.updateVisit(this.visitId, visitData).subscribe({
      next: (updatedVisit: Visit) => {
        this.isLoading = false;
        this.successMessage = 'Visite mise à jour avec succès';
        setTimeout(() => {
          this.router.navigate(['/admin/visit']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la mise à jour de la visite';
        console.error(err);
      }
    });
  }
  onCancel(): void {
    this.router.navigate(['/admin/visit']);
  }

}
