import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitService } from 'src/app/core/services/unit.service';

@Component({
  selector: 'app-unit-create',
  templateUrl: './unit-create.component.html',
  styleUrls: ['./unit-create.component.scss']
})
export class UnitCreateComponent implements OnInit {
  unitForm: FormGroup = this.fb.group({  // Only type and price fields now
    type: ['', [Validators.required]],  // Type input field
    price: ['', [Validators.required, Validators.min(0)]],  // Price input field
  });
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  logementId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private unitService: UnitService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get logement ID from route
    this.logementId = Number(this.route.snapshot.paramMap.get('logementId'));
  }

  onSubmit(): void {
    if (this.unitForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Prepare unit data
    const unitData = {
      ...this.unitForm.value,
      logementId: this.logementId
    };

    this.unitService.createUnit(unitData).subscribe(
      () => {
        this.successMessage = 'Unit successfully created!';
        this.isLoading = false;

        // Redirect to the logement list after successful creation
        this.router.navigate(['/admin/logement/list']);
      },
      () => {
        this.errorMessage = 'Error creating unit. Please try again later.';
        this.isLoading = false;
      }
    );
  }
}
