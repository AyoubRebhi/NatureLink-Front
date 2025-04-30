import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackService } from 'src/app/core/services/pack.service';
import { Pack, PackDTO } from 'src/app/core/models/pack.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pack-update',
  templateUrl: './pack-update.component.html',
  styleUrls: ['./pack-update.component.scss']
})
export class PackUpdateComponent implements OnInit {
  id: number | null = null;
  pack: Pack | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  submitting: boolean = false;

  // Editable fields for IDs
  userId: string = '';
  logementIds: string = '';
  restaurantIds: string = '';
  activityIds: string = '';
  transportIds: string = '';
  evenementIds: string = '';

  constructor(
    private route: ActivatedRoute,
    private packService: PackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPack();
  }

  private loadPack(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('Route param id:', idParam);
    if (idParam) {
      this.id = +idParam;
      if (isNaN(this.id) || this.id <= 0) {
        this.errorMessage = `Invalid pack ID: ${idParam}`;
        this.loading = false;
        console.error('Invalid pack ID:', idParam);
        return;
      }
      console.log('Fetching pack with ID:', this.id);
      this.loading = true;
      this.packService.getPackById(this.id).subscribe({
        next: (data: Pack) => {
          console.log('Pack data received:', JSON.stringify(data, null, 2));
          this.pack = data;
          // Populate ID fields with null checks
          this.userId = data.user?.id ? data.user.id.toString() : '';
          this.logementIds = data.logements?.length ? data.logements.map(item => item.id).join(', ') : '';
          this.restaurantIds = data.restaurants?.length ? data.restaurants.map(item => item.id).join(', ') : '';
          this.activityIds = data.activities?.length ? data.activities.map(item => item.id).join(', ') : '';
          this.transportIds = data.transports?.length ? data.transports.map(item => item.id).join(', ') : '';
          this.evenementIds = data.evenements?.length ? data.evenements.map(item => item.id).join(', ') : '';
          console.log('Populated fields:', {
            userId: this.userId,
            logementIds: this.logementIds,
            restaurantIds: this.restaurantIds,
            activityIds: this.activityIds,
            transportIds: this.transportIds,
            evenementIds: this.evenementIds
          });
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          let errorMsg = 'Failed to load pack details. Please try again later.';
          if (error.status === 404) {
            errorMsg = `Pack with ID ${this.id} not found.`;
          } else if (error.status === 0) {
            errorMsg = 'Cannot connect to the server. Check if the backend is running at http://localhost:9000.';
          } else if (error.status >= 500) {
            errorMsg = 'Server error occurred. Please check backend logs for details.';
          } else if (error.status === 400) {
            errorMsg = 'Bad request. Please verify the pack ID.';
          }
          this.errorMessage = errorMsg;
          console.error('Error loading pack:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: error.message,
            errorDetails: error.error ? JSON.stringify(error.error, null, 2) : 'No error details available',
            requestId: this.id,
            timestamp: new Date().toISOString()
          });
        }
      });
    } else {
      this.errorMessage = 'No pack ID provided in the URL.';
      this.loading = false;
      console.error('No pack ID in route params');
    }
  }

  submitForm(): void {
    if (!this.pack || !this.id) {
      this.errorMessage = 'Cannot submit: Pack data or ID is missing.';
      return;
    }

    this.submitting = true;
    const packDTO: PackDTO = {
      id: this.id,
      nom: this.pack.nom,
      prix: this.pack.prix,
      description: this.pack.description,
      logements: this.logementIds ? this.logementIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
      restaurants: this.restaurantIds ? this.restaurantIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
      activities: this.activityIds ? this.activityIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
      transports: this.transportIds ? this.transportIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
      evenements: this.evenementIds ? this.evenementIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
      averageRating: this.pack.averageRating
      
    };

    console.log('Submitting PackDTO:', JSON.stringify(packDTO, null, 2));
    this.packService.updatePack(this.id, packDTO).subscribe({
      next: () => {
        console.log('Pack updated successfully, navigating to list');
        this.submitting = false;
        this.router.navigate(['/admin/list-admin']);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting = false;
        this.errorMessage = 'Failed to update pack. Please try again.';
        console.error('Error updating pack:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          errorDetails: error.error ? JSON.stringify(error.error, null, 2) : 'No error details'
        });
      }
    });
  }

  goBack(): void {
    console.log('Navigating back to list');
    this.router.navigate(['/admin/list-admin']);
  }

  getIdsAsString(items: { id: number }[] | undefined): string {
    return items && items.length > 0 ? items.map(i => i.id).join(', ') : 'None';
  }
}