import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GuideService } from 'src/app/core/services/guide.service';
import { Guide } from 'src/app/core/models/guide';

@Component({
  selector: 'app-guide-update',
  templateUrl: './guide-update.component.html',
  styleUrls: ['./guide-update.component.scss']
})
export class GuideUpdateComponent implements OnInit {
  guideForm: FormGroup;
  guideId!: number;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private guideService: GuideService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.guideForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.guideId = Number(this.route.snapshot.paramMap.get('id'));

    this.guideService.getGuideById(this.guideId).subscribe({
      next: (guide: Guide) => {
        this.guideForm.patchValue(guide);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du guide.';
        console.error(err);
      }
    });
  }

  updateGuide(): void {
    if (this.guideForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    this.guideService.updateGuide(this.guideId, this.guideForm.value).subscribe({
      next: () => {
        this.successMessage = 'Guide mis à jour avec succès !';
        setTimeout(() => this.router.navigate(['/admin/guides']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour du guide.';
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/guides']);
  }
}
