import { Component, OnInit } from '@angular/core';
import { PackDTO } from 'src/app/core/models/pack.model';
import { PackService } from 'src/app/core/services/pack.service';
import { Router } from '@angular/router';
import { LogementService, Logement } from 'src/app/core/services/logement.service';
import { RestaurantService, Restaurant } from 'src/app/core/services/restaurant.service';
import { EventServiceService } from 'src/app/core/services/event-service.service';
import { Event } from 'src/app/core/models/event.module';
import { Activity, ActivityService } from 'src/app/core/services/activity.service';
import { Transport, TransportService } from 'src/app/core/services/transport.service';

@Component({
  selector: 'app-pack-add',
  templateUrl: './pack-add.component.html',
  styleUrls: ['./pack-add.component.scss']
})
export class PackAddComponent implements OnInit {
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

  logements: Logement[] = [];
  restaurants: Restaurant[] = [];
  evenements: Event[] = [];
  activities: Activity[] = [];
  transports: Transport[] = [];

  loading = false;
  errorMessage: string | null = null;
    successMessage: string | null = null;

  constructor(
    private packService: PackService,
    private logementService: LogementService,
    private restaurantService: RestaurantService,
    private eventService: EventServiceService,
    private activityService: ActivityService,
    private transportService: TransportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.logementService.getAllLogements().subscribe({
      next: (data) => (this.logements = data),
      error: (err) => {
        console.error('Error fetching logements:', err);
        this.errorMessage = 'Failed to load logements.';
      }
    });

    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => (this.restaurants = data),
      error: (err) => {
        console.error('Error fetching restaurants:', err);
        this.errorMessage = 'Failed to load restaurants.';
      }
    });

    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        console.log('Events:', data); // Optional: for debugging
        this.evenements = data;
      },
      error: (err) => {
        console.error('Error fetching evenements:', err);
        this.errorMessage = 'Failed to load evenements.';
      }
    });

    this.activityService.getAllActivities().subscribe({
      next: (data) => (this.activities = data),
      error: (err) => {
        console.error('Error fetching activities:', err);
        this.errorMessage = 'Failed to load activities.';
      }
    });

    this.transportService.getAllTransports().subscribe({
      next: (data) => (this.transports = data),
      error: (err) => {
        console.error('Error fetching transports:', err);
        this.errorMessage = 'Failed to load transports.';
      }
    });
  }

  submitForm(): void {
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

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    console.log('Submitting pack:', this.pack); // Optional: for debugging

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
  toggleSelection(category: string, id: number): void {
    const array = this.pack[category as keyof PackDTO] as number[];
    const index = array.indexOf(id);
    
    if (index === -1) {
      array.push(id);
    } else {
      array.splice(index, 1);
    }
  }
  // Add these properties to your component class
itemsPerPage: number = 5; // Items to show per page
currentPages: { [key: string]: number } = {
  logements: 1,
  restaurants: 1,
  activities: 1,
  transports: 1,
  evenements: 1
};

// Add these methods to your component class
getPaginatedItems(items: any[], category: string): any[] {
  const startIndex = (this.currentPages[category] - 1) * this.itemsPerPage;
  return items.slice(startIndex, startIndex + this.itemsPerPage);
}

totalPages(category: string): number {
  return Math.ceil((this.pack[category as keyof PackDTO] as any[]).length / this.itemsPerPage);
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
goBack(): void {
  console.log('Navigating back to list');
  this.router.navigate(['/admin/list-admin']);
}
}