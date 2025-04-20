import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PackService } from 'src/app/core/services/pack.service';
import { PackDTO } from 'src/app/core/models/pack.model';

@Component({
  selector: 'app-pack-list-a',
  templateUrl: './pack-list-a.component.html',
  styleUrls: ['./pack-list-a.component.scss']
})
export class PackListAComponent implements OnInit {
  packs: PackDTO[] = [];
  selectedPack: PackDTO | null = null;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private packService: PackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPacks();
  }

  loadPacks(): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.packService.getAllPacks().subscribe({
      next: (data) => {
        this.loading = false;
        
        if (!Array.isArray(data)) {
          console.error('Invalid data format:', data);
          this.errorMessage = 'Invalid data received from server';
          this.packs = [];
          return;
        }

        this.packs = data.map(pack => ({
          id: pack.id,
          nom: pack.nom || 'No Name',
          prix: pack.prix || 0,
          description: pack.description || 'No Description',
          userId: pack.userId || 0,
          logements: pack.logements || [],
          restaurants: pack.restaurants || [],
          activities: pack.activities || [],
          transports: pack.transports || [],
          evenements: pack.evenements || []
        }));

        if (this.packs.length === 0) {
          this.successMessage = 'No packs found. Create your first pack!';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching packs:', error);
        this.errorMessage = error.message || 'Failed to load packs. Please try again.';
        this.packs = [];
      }
    });
  }

  selectPack(pack: PackDTO): void {
    this.selectedPack = this.selectedPack?.id === pack.id ? null : pack;
  }

  goToAdd(): void {
    this.router.navigate(['/admin/addpack']);
  }

  goToUpdate(id: number): void {
    if (!id) {
      this.errorMessage = 'Invalid pack ID';
      return;
    }
    this.router.navigate(['/admin/update', id]);
  }

  deletePack(id: number): void {
    if (!id) {
      this.errorMessage = 'Invalid pack ID';
      return;
    }

    if (!confirm('Are you sure you want to delete this pack?')) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.packService.deletePack(id).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Pack deleted successfully';
        this.selectedPack = null;
        this.loadPacks();
        
        // Clear success message after 3 seconds
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error deleting pack:', error);
        this.errorMessage = error.error?.message || 'Failed to delete pack';
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}