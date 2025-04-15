import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogementService } from 'src/app/core/services/logement.service';
import { EquipementService } from 'src/app/core/services/equipement.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logement } from 'src/app/core/models/logement.model';
import { Equipement } from 'src/app/core/models/equipement.model';

@Component({
  selector: 'app-logement-edit',
  templateUrl: './logement-edit.component.html',
  styleUrls: ['./logement-edit.component.scss'],
})
export class LogementEditComponent implements OnInit {
  logementForm: FormGroup;
  logementId!: number;
  allEquipements: Equipement[] = [];

  constructor(
    private route: ActivatedRoute,
    private logementService: LogementService,
    private equipementService: EquipementService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.logementForm = this.fb.group({
      titre: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s\\-\'$]+$')]],  // Title should be required and match specific pattern
      description: ['', Validators.required],  // Description should be required
      location: ['', Validators.required],  // Location should be required
      type: ['', Validators.required],  // Type should be required
      price: ['', [Validators.required, Validators.min(1)]],  // Price should be a positive number
      proprietarield: [''],  // Proprietarield should be required
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$'), Validators.minLength(8)]], 
      email: ['', [Validators.required, Validators.email]],  // Email should be required and in valid format
      capacity: ['', [Validators.required, Validators.min(1)]],  // Capacity should be a positive number
      socialMedia: [''],
      singleRooms: ['', Validators.min(1)],  // Single rooms should be at least 1
      doubleRooms: ['', Validators.min(1)],  // Double rooms should be at least 1
      equipements: [[]],  // Holds the selected equipement IDs
    });
  }

  ngOnInit(): void {
    this.logementId = +this.route.snapshot.paramMap.get('id')!;

    // Fetch logement and pre-fill form
    this.logementService.getLogementById(this.logementId).subscribe((logement) => {
      this.logementForm.patchValue(logement);
      this.logementForm.get('equipements')?.setValue(logement.equipements?.map((e: any) => e.id));
    });

    // Fetch all equipements
    this.equipementService.getAll().subscribe((data) => {
      this.allEquipements = data;
    });
  }

  onEquipementToggle(event: any) {
    const selectedEquipements = this.logementForm.get('equipements')?.value || [];

    if (event.target.checked) {
      selectedEquipements.push(+event.target.value);
    } else {
      const index = selectedEquipements.indexOf(+event.target.value);
      if (index > -1) {
        selectedEquipements.splice(index, 1);
      }
    }

    this.logementForm.get('equipements')?.setValue(selectedEquipements);
  }

  onSubmit() {
    this.logementForm.markAllAsTouched(); // Trigger validation for all fields
    if (this.logementForm.valid) {
      const formValue = this.logementForm.value;
      const updatedLogement = {
        ...formValue,
        equipements: formValue.equipements.map((id: number) => ({ id })),  // Ensure equipements have ids
      };
  
      this.logementService.updateLogement(this.logementId, updatedLogement)
        .subscribe(() => {
          this.router.navigate(['/admin/logement/list']);
        });
    } else {
      // Handle invalid form (display errors, etc.)
      console.log('Form is invalid');
    }
  }
  
  
}
