// guide-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { GuideService } from 'src/app/core/services/guide.service';

@Component({
  selector: 'app-guide-form',
  templateUrl: './guide-form.component.html',
  styleUrls: ['./guide-form.component.scss']
})
export class GuideFormComponent implements OnInit {
  guideForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private guideService: GuideService,
    private router: Router
  ) {
    this.guideForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.guideForm.valid) {
      this.guideService.createGuide(this.guideForm.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/guides']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création du guide';
          console.error(err);
        }
      });
    }
  }
}
