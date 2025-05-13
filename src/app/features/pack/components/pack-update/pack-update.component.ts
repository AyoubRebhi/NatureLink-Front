import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackService } from 'src/app/core/services/pack.service';
import { Pack, PackDTO } from 'src/app/core/models/pack.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LogementService, Logement } from 'src/app/core/services/logement.service';
import { RestaurantService, Restaurant } from 'src/app/core/services/restaurant.service';
import { EventServiceService } from 'src/app/core/services/event-service.service';
import { Event } from 'src/app/core/models/event.module';
import { Activity, ActivityService } from 'src/app/core/services/activity.service';
import { Transport, TransportService } from 'src/app/core/services/transport.service';

@Component({
  selector: 'app-pack-update',
  templateUrl: './pack-update.component.html',
  styleUrls: ['./pack-update.component.scss']
})
export class PackUpdateComponent implements OnInit {
  id: number | null = null;
  pack: PackDTO | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  submitting: boolean = false;

  // Dropdown data
  logements: Logement[] = [];
  restaurants: Restaurant[] = [];
  evenements: Event[] = [];
  activities: Activity[] = [];
  transports: Transport[] = [];
  successMessage: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private packService: PackService,
    private logementService: LogementService,
    private restaurantService: RestaurantService,
    private eventService: EventServiceService,
    private activityService: ActivityService,
    private transportService: TransportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPack();
    this.loadDropdownData();
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
      this.packService.getPackById(this.id).subscribe({
        next: (data: Pack) => {
          console.log('Pack data received:', JSON.stringify(data, null, 2));
          // Map Pack to PackDTO for form binding
          this.pack = {
            id: data.id,
            nom: data.nom,
            prix: data.prix,
            description: data.description,
            logements: data.logements?.map(item => item.id) || [],
            restaurants: data.restaurants?.map(item => item.id) || [],
            activities: data.activities?.map(item => item.id) || [],
            transports: data.transports?.map(item => item.id) || [],
            evenements: data.evenements?.map(item => item.id) || [],
            userId: data.user?.id,
            averageRating: data.averageRating,
          };
          console.log('Populated pack:', JSON.stringify(this.pack, null, 2));
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          let errorMsg = 'Failed to load pack details. Please try again later.';
          if (error.status === 404) {
            errorMsg = `Pack with ID ${this.id} not found.`;
          } else if (error.status === 0) {
            errorMsg = 'Cannot connect to the server. Check if the backend is running at http://backend/picloud.';
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

  private loadDropdownData(): void {
    this.logementService.getAllLogements().subscribe({
      next: (data) => {
        this.logements = data;
        console.log('Logements loaded:', JSON.stringify(data, null, 2));
      },
      error: (err) => {
        console.error('Error fetching logements:', err);
        this.errorMessage = 'Failed to load logements.';
      }
    });

    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        console.log('Restaurants loaded:', JSON.stringify(data, null, 2));
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
        this.errorMessage = 'Failed to load restaurants.';
      }
    });

    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.evenements = data;
        console.log('Events loaded:', JSON.stringify(data, null, 2));
      },
      error: (err) => {
        console.error('Error fetching evenements:', err);
        this.errorMessage = 'Failed to load evenements.';
      }
    });

    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        console.log('Activities loaded:', JSON.stringify(data, null, 2));
      },
      error: (err) => {
        console.error('Error fetching activities:', err);
        this.errorMessage = 'Failed to load activities.';
      }
    });

    this.transportService.getAllTransports().subscribe({
      next: (data) => {
        this.transports = data;
        console.log('Transports loaded:', JSON.stringify(data, null, 2));
      },
      error: (err) => {
        console.error('Error fetching transports:', err);
        this.errorMessage = 'Failed to load transports.';
      }
    });
  }

  // Helper methods to get selected item details for summary
  getSelectedLogements(): Logement[] {
    return this.pack?.logements?.map(id => this.logements.find(l => l.id === id)).filter((l): l is Logement => !!l) || [];
  }

  getSelectedRestaurants(): Restaurant[] {
    return this.pack?.restaurants?.map(id => this.restaurants.find(r => r.id === id)).filter((r): r is Restaurant => !!r) || [];
  }

  getSelectedEvents(): Event[] {
    return this.pack?.evenements?.map(id => this.evenements.find(e => e.id === id)).filter((e): e is Event => !!e) || [];
  }

  getSelectedActivities(): Activity[] {
    return this.pack?.activities?.map(id => this.activities.find(a => a.id === id)).filter((a): a is Activity => !!a) || [];
  }

  getSelectedTransports(): Transport[] {
    return this.pack?.transports?.map(id => this.transports.find(t => t.id === id)).filter((t): t is Transport => !!t) || [];
  }

  submitForm(): void {
    if (!this.pack || !this.id) {
      this.errorMessage = 'Cannot submit: Pack data or ID is missing.';
      return;
    }

    // Validate at least two categories
    const selectedCategories = [
      this.pack.logements?.length || 0,
      this.pack.restaurants?.length || 0,
      this.pack.activities?.length || 0,
      this.pack.transports?.length || 0,
      this.pack.evenements?.length || 0
    ].filter(count => count > 0).length;

    if (selectedCategories < 2) {
      this.errorMessage = 'Please select at least two categories (e.g., restaurant and activity).';
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    console.log('Submitting PackDTO:', JSON.stringify(this.pack, null, 2));
    this.packService.updatePack(this.id, this.pack).subscribe({
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
  itemsPerPage: number = 5; // Items to show per page
currentPages: { [key: string]: number } = {
  logements: 1,
  restaurants: 1,
  activities: 1,
  transports: 1,
  evenements: 1
};

  getPaginatedItems(items: any[], category: string): any[] {
    const startIndex = (this.currentPages[category] - 1) * this.itemsPerPage;
    return items.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  totalPages(category: string): number {
    return Math.ceil((this.pack?.[category as keyof PackDTO] as any[])?.length / this.itemsPerPage) || 0;
  }
  
  nextPage(category: string): void {
    if (this.currentPages[category] < this.totalPages(category)) {
      this.currentPages[category]++;
    }
  }
  
  prevPage(category: string): void {
    if (this.currentPages[category] > 1) {
      this.currentPages[category]--;
    }
  }
  toggleSelection(category: string, id: number): void {
    const array = this.pack?.[category as keyof PackDTO] as number[] ?? [];
    const index = array.indexOf(id);
    
    if (index === -1) {
      array.push(id);
    } else {
      array.splice(index, 1);
    }
  }
}