import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TravelService, ItineraryRequest, ItineraryResponse, DayItinerary } from '../../../core/services/travel.service';
import { MapService } from '../../../core/services/map.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-trave',
  templateUrl: './trave.component.html',
  styleUrls: ['./trave.component.scss']
})
export class TraveComponent implements OnInit {
  travelForm: FormGroup;
  isLoading = false;
  itineraryResponse: ItineraryResponse | null = null;
  errorMessage: string | null = null;
  activeDay: number = 1;
  mapInitialized = false;
  selectedLocation: L.LatLng | null = null;
  locationName: string | null = null;

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

  initMap(): void {
    if (this.mapInitialized) return;

    // Initialiser la carte avec une vue par défaut (Paris par exemple)
    this.mapService.initMap('destinationMap', 48.8566, 2.3522);
    const map = this.mapService.getMap();
    
    if (map) {
      // Ajouter un événement de clic sur la carte
      map.on('click', async (e: L.LeafletMouseEvent) => {
        this.selectedLocation = e.latlng;
        
        // Récupérer le nom du lieu
        this.locationName = await this.mapService.reverseGeocode(e.latlng);
        
        // Mettre à jour le formulaire
        this.travelForm.patchValue({
          destination: this.locationName || `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
        });
        
        // Ajouter un marqueur à l'emplacement sélectionné
        this.mapService.clearMarkers();
        this.mapService.addMarker(e.latlng, true);
      });

      this.mapInitialized = true;
    }
  }

  async onSearchAddress(address: string): Promise<void> {
    if (!address) return;

    const location = await this.mapService.geocodeAddress(address);
    if (location && this.mapService.getMap()) {
      this.mapService.getMap()?.flyTo(location, 13);
      this.selectedLocation = location;
      this.locationName = address;
      
      this.travelForm.patchValue({
        destination: address
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

  get f() { return this.travelForm.controls; }
}