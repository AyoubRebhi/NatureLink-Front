import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guide } from 'src/app/core/models/guide';
import { Monument } from 'src/app/core/models/monument';
import { Visit } from 'src/app/core/models/visit';
import { GuideService } from 'src/app/core/services/guide.service';
import { MonumentService } from 'src/app/core/services/monument.service';
import { VisitService } from 'src/app/core/services/visit.service';

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
      time: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required],
      monumentId: ['', Validators.required],
      guideId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.visitId = +this.route.snapshot.params['id'];
    this.loadVisit();
    this.loadMonuments();
    this.loadGuides();
  }

  loadVisit(): void {
    this.isLoading = true;
    this.visitService.getVisitById(this.visitId).subscribe({
      next: (visit) => {
        this.visitForm.patchValue({
          date: this.formatDate(visit.date),
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
      }
    });
  }

  loadMonuments(): void {
    this.monumentService.getAllMonuments().subscribe({
      next: (data) => {
        this.monuments = data;
      },
      error: (err) => {
        console.error('Error loading monuments:', err);
      }
    });
  }

  loadGuides(): void {
    this.guideService.getAllGuides().subscribe({
      next: (data) => {
        this.guides = data;
      },
      error: (err) => {
        console.error('Error loading guides:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.visitForm.invalid) {
      this.visitForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.isLoading = true;
    const visitData = {
      id: this.visitId,
      ...this.visitForm.value,
      monument: { id: this.visitForm.value.monumentId },
      guide: { id: this.visitForm.value.guideId }
    };

    this.visitService.updateVisit(this.visitId, visitData).subscribe({
      next: () => {
        this.successMessage = 'Visite mise à jour avec succès';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/admin/visit']), 1500);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour de la visite';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/visit']);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
