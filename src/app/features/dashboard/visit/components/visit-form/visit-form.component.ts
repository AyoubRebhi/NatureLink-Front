import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GuideService } from 'src/app/core/services/guide.service';
import { MonumentService } from 'src/app/core/services/monument.service';
import { VisitService } from 'src/app/core/services/visit.service';
import { Visit } from 'src/app/core/models/visit'; // Added import

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.scss']
})
export class VisitFormComponent implements OnInit {
  visitForm: FormGroup;
  monuments: any[] = [];
  guides: any[] = [];
  errorMessage = '';
  isLoading = false;
  isEditMode = false;
  visitId?: number;

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private monumentService: MonumentService,
    private guideService: GuideService,
    private router: Router,
    private route: ActivatedRoute
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
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.visitId = +params['id'];
        this.loadVisit(this.visitId);
      }
    });
    this.loadMonuments();
    this.loadGuides();
  }

  loadVisit(id: number): void {
    this.isLoading = true;
    this.visitService.getVisitById(id).subscribe({
      next: (visit) => {
        this.visitForm.patchValue({
          date: this.formatDateForInput(visit.date),
          time: visit.time,
          price: visit.price,
          duration: visit.duration,
          monumentId: visit.monument?.id,
          guideId: visit.guide?.id
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de la visite: ' + (err.error?.message || err.message);
        this.isLoading = false;
        console.error('Load Visit Error:', err);
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
        this.errorMessage = 'Erreur lors du chargement des monuments';
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
        this.errorMessage = 'Erreur lors du chargement des guides';
      }
    });
  }

  onSubmit(): void {
    if (this.visitForm.invalid) {
      this.visitForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.visitForm.value;

    // Create payload with monument and guide as objects
    const visitData: Partial<Visit> = {
      date: formValue.date, // YYYY-MM-DD string
      time: formValue.time, // HH:mm string
      price: parseFloat(formValue.price),
      duration: formValue.duration,
      monument: { id: parseInt(formValue.monumentId) },
      guide: { id: parseInt(formValue.guideId) }
    };

    console.log('Sending visitData:', JSON.stringify(visitData, null, 2));

    const operation = this.isEditMode
      ? this.visitService.updateVisit(this.visitId!, visitData)
      : this.visitService.createVisit(visitData);

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/visit']);
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.error?.error || err.message;
        this.errorMessage = this.isEditMode
          ? `Erreur lors de la modification de la visite: ${errorMsg}`
          : `Erreur lors de la création de la visite: ${errorMsg}`;
        this.isLoading = false;
        console.error('API Error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/visit']);
  }

  private formatDateForInput(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return '';
    }
  }
}
