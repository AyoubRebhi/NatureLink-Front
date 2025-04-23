import { Component } from '@angular/core';
import { PackDTO } from 'src/app/core/models/pack.model';
import { PackService } from 'src/app/core/services/pack.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pack-add',
  templateUrl: './pack-add.component.html',
  styleUrls: ['./pack-add.component.scss']
})
export class PackAddComponent {
  pack: PackDTO = {
    nom: '',
    prix: 0,
    description: '',
    logements: [],
    restaurants: [],
    activities: [],
    transports: [],
    evenements: [],
    userId: 8 // Static user
  };

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private packService: PackService, private router: Router) {}

  submitForm() {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.packService.addPack(this.pack).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Pack created successfully!';
        setTimeout(() => this.router.navigate(['/admin/list-admin']), 1500);
      },
      error: (err) => {
        console.error('Error adding pack:', err);
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to create pack. Please try again.';
      }
    });
  }

  updateIdList(event: Event, property: keyof Pick<PackDTO, 'logements' | 'restaurants' | 'activities' | 'transports' | 'evenements'>) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.pack[property] = value 
      ? value.split(',')
            .map(id => parseInt(id.trim(), 10))
            .filter(id => !isNaN(id))
      : [];
  }
}