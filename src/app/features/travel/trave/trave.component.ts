import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TravelService, ItineraryRequest, ItineraryResponse, DayItinerary } from '../../../core/services/travel.service';
import { MapService } from '../../../core/services/map.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-trave',
  templateUrl: './trave.component.html',
  styleUrls: ['./trave.component.scss']
})
export class TraveComponent implements OnInit, OnDestroy {
  travelForm: FormGroup;
  isLoading = false;
  itineraryResponse: ItineraryResponse | null = null;
  errorMessage: string | null = null;
  activeDay = 1;
  mapInitialized = false;
  selectedLocation: L.LatLng | null = null;
  locationName: string | null = null;
  private searchDebounceTimer: any;

  comfortLevels = [
    { value: 'économique', label: 'Économique' },
    { value: 'standard', label: 'Standard' },
    { value: 'luxe', label: 'Luxe' }
  ];

  travelStyles = [
    { value: 'culturel', label: 'Culturel' },
    { value: 'gastronomique', label: 'Gastronomique' },
    { value: 'nature', label: 'Nature' },
    { value: 'romantique', label: 'Romantique' }
  ];

  constructor(
    private travelService: TravelService,
    private mapService: MapService,
    private fb: FormBuilder
  ) {
    this.travelForm = this.fb.group({
      destination: ['', Validators.required],
      days: [3, [Validators.required, Validators.min(1), Validators.max(30)]],
      comfort_level: ['standard', Validators.required],
      travel_style: ['culturel', Validators.required]
    });
  }

  ngOnInit(): void {
    this.travelService.checkHealth().subscribe({
      next: () => console.log('API connectée'),
      error: (err) => console.error('Erreur de connexion à l\'API:', err)
    });

    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }

  initMap(): void {
    if (this.mapInitialized) return;

    this.mapService.initMap('destinationMap', 48.8566, 2.3522);
    const map = this.mapService.getMap();
    
    if (map) {
      map.on('click', async (e: L.LeafletMouseEvent) => {
        this.selectedLocation = e.latlng;
        this.locationName = await this.mapService.getCityName(e.latlng);
        
        this.travelForm.patchValue({
          destination: this.locationName || `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
        });
        
        this.mapService.clearMarkers();
        this.mapService.addMarker(e.latlng, true);
      });

      this.mapInitialized = true;
    }
  }

  async onDestinationInput(value: string): Promise<void> {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(async () => {
      if (value && value.length > 2) {
        try {
          const cityName = await this.mapService.extractCityFromAddress(value);
          const searchTerm = cityName || value;
          
          const location = await this.mapService.geocodeAddress(searchTerm);
          const map = this.mapService.getMap();
          if (location && map) {
            map.flyTo(location, 13);
            this.selectedLocation = location;
            this.locationName = await this.mapService.getCityName(location) || searchTerm;
            
            this.mapService.clearMarkers();
            this.mapService.addMarker(location, true);
          }
        } catch (error) {
          console.error('Error during destination input:', error);
        }
      }

    }, 500);  }

  handleEnter(event: KeyboardEvent): void {
    if ((event.target as HTMLInputElement).id === 'destination') {
      event.preventDefault();
    }
  }

  async onSearchAddress(address: string): Promise<void> {
    if (!address) return;

    const cityName = await this.mapService.extractCityFromAddress(address);
    const searchTerm = cityName || address;

    const location = await this.mapService.geocodeAddress(searchTerm);
    const map = this.mapService.getMap();
    if (location && map) {
      map.flyTo(location, 13);
      this.selectedLocation = location;
      this.locationName = await this.mapService.getCityName(location) || searchTerm;
      
      this.travelForm.patchValue({
        destination: this.locationName
      });
      
      this.mapService.clearMarkers();
      this.mapService.addMarker(location, true);
    }

  }
  onSubmit(): void {
    if (this.travelForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.itineraryResponse = null;
    this.activeDay = 1;

    const request: ItineraryRequest = {
      destination: this.travelForm.value.destination,
      days: this.travelForm.value.days,
      comfort_level: this.travelForm.value.comfort_level,
      travel_style: this.travelForm.value.travel_style
    };

    this.travelService.generateItinerary(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          this.itineraryResponse = response;
        } else {
          this.errorMessage = response.message || 'Erreur inconnue';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erreur lors de la génération de l\'itinéraire';
      }
    });
  }

  setActiveDay(day: number): void {
    this.activeDay = day;
  }

  getActiveDay(): DayItinerary | null {
    if (!this.itineraryResponse?.data?.itinerary) return null;
    return this.itineraryResponse.data.itinerary.find(d => d.day === this.activeDay) || null;
  }

  clearMap(): void {
    this.mapService.clearMap();
    this.selectedLocation = null;
    this.locationName = null;
    this.travelForm.patchValue({
      destination: ''
    });
  }

  resetForm(): void {
    this.travelForm.reset({
      days: 3,
      comfort_level: 'standard',
      travel_style: 'culturel'
    });
    this.clearMap();
    this.itineraryResponse = null;
    this.errorMessage = null;
  }
  
  get f() { return this.travelForm.controls; }
}