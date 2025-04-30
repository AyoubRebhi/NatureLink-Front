import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MonumentService } from 'src/app/core/services/monument.service';

@Component({
  selector: 'app-monument-enrich',
  templateUrl: './monument-enrich.component.html',
  styleUrls: ['./monument-enrich.component.scss']
})
export class MonumentEnrichComponent {
  enrichForm: FormGroup;
  enrichedMonument: any = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private monumentService: MonumentService) {
    this.enrichForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.enrichForm.valid) {
      const name = this.enrichForm.value.name;
      this.monumentService. enrichMonument(name).subscribe({
        next: (monument) => (this.enrichedMonument = monument),
        error: () => (this.errorMessage = 'Failed to enrich monument data')
      });
    }
  }
}
