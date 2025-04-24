// guide-update.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Guide } from 'src/app/core/models/guide';
import { GuideService } from 'src/app/core/services/guide.service';


@Component({
  selector: 'app-guide-update',
  templateUrl: './guide-update.component.html',
  styleUrls: ['./guide-update.component.scss']
})
export class GuideUpdateComponent implements OnInit {
  guideForm: FormGroup;
  guideId!: number;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private guideService: GuideService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.guideForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.guideId = +this.route.snapshot.params['id'];
    this.loadGuide();
  }

  loadGuide(): void {
    this.guideService.getGuideById(this.guideId).subscribe({
      next: (guide) => {
        this.guideForm.patchValue({
          firstName: guide.firstName,
          lastName: guide.lastName
        });
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du guide';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.guideForm.valid) {
      const updatedGuide: Guide = {
        id: this.guideId,
        ...this.guideForm.value
      };

      this.guideService.updateGuide(this.guideId, updatedGuide).subscribe({
        next: () => {
          this.router.navigate(['/admin/guides']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour du guide';
          console.error(err);
        }
      });
    }
  }
}
