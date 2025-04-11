import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MapService } from '../../../core/services/map.service';
import { CarbonFootprintService } from '../../../core/services/footprint.service';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-carbon-calculator',
  templateUrl: './carbon-calculator.component.html',
  styleUrls: ['./carbon-calculator.component.scss']
})
export class CarbonCalculatorComponent implements AfterViewInit, OnDestroy {
  distance: number = 0;
  carbonFootprint: number = 0;
  transportType: keyof typeof this.emissionFactors = 'car';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  depart: string = '';
  arrivee: string = '';
  private subscriptions: Subscription = new Subscription();

  readonly emissionFactors = {
    car: 0.192,
    bus: 0.103,
    train: 0.041,
    plane: 0.245,
    bicycle: 0,
    walk: 0
  } as const;

  constructor(
    private mapService: MapService,
    private carbonService: CarbonFootprintService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.mapService.clearMap();
  }


  // Dans CarbonCalculatorComponent
  private setupMapClickHandler(): void {
    const map = this.mapService.getMap();
    if (!map) return;
  
    map.on('click', async (e: L.LeafletMouseEvent) => {
      try {
        this.isLoading = true;
        
        // Déterminer quel champ mettre à jour en fonction du dernier champ rempli
        let targetField: 'depart' | 'arrivee';
        if (!this.depart && !this.arrivee) {
          targetField = 'depart';
        } else if (this.depart && !this.arrivee) {
          targetField = 'arrivee';
        } else {
          // Si les deux champs sont remplis, demander à l'utilisateur lequel remplacer
          const replaceDepart = confirm('Voulez-vous remplacer le point de départ? (OK pour départ, Annuler pour arrivée)');
          targetField = replaceDepart ? 'depart' : 'arrivee';
        }
  
        // Convertir les coordonnées en adresse
        const address = await this.mapService.reverseGeocode(e.latlng);
        if (!address) {
          throw new Error('Impossible de trouver une adresse pour cet emplacement');
        }
  
        // Mettre à jour le champ correspondant
        if (targetField === 'depart') {
          this.depart = address;
        } else {
          this.arrivee = address;
        }
  
        // Déclencher la mise à jour du marqueur
        await this.onAddressChange(targetField);
      } catch (error) {
        this.handleError(error instanceof Error ? error.message : 'Erreur lors du clic sur la carte');
      } finally {
        this.isLoading = false;
      }
    });
  }

// Modifiez initMap pour inclure le handler
initMap(): void {
  try {
    this.mapService.initMap('map', 36.8065, 10.1815); // Tunis
    this.setupMapClickHandler(); // Ajoutez cette ligne
  } catch (error) {
    this.handleError('Erreur lors de l\'initialisation de la carte');
  }
}

  

  private adjustMapZoom(): void {
    const map = this.mapService.getMap();
    const startLatLng = this.mapService.getStartLatLng();
    const endLatLng = this.mapService.getEndLatLng();
    
    if (!map || !startLatLng || !endLatLng) {
      return;
    }
  
    // Calculer la distance entre les deux points
    const distance = startLatLng.distanceTo(endLatLng);
  
    // Déterminer le niveau de zoom en fonction de la distance
    let zoomLevel: number;
    if (distance > 100000) { // > 100 km
      zoomLevel = 7;
    } else if (distance > 50000) { // 50-100 km
      zoomLevel = 9;
    } else if (distance > 20000) { // 20-50 km
      zoomLevel = 11;
    } else if (distance > 10000) { // 10-20 km
      zoomLevel = 12;
    } else if (distance > 5000) { // 5-10 km
      zoomLevel = 13;
    } else { // < 5 km
      zoomLevel = 14;
    }
  
    // Créer une zone qui contient les deux points
    const bounds = L.latLngBounds([startLatLng, endLatLng]);
    
    // Ajuster la vue de la carte
    map.fitBounds(bounds, {
      padding: [50, 50], // Marge intérieure en pixels
      maxZoom: zoomLevel // Niveau de zoom maximum
    });
  }
  
  async onAddressChange(type: 'depart' | 'arrivee'): Promise<void> {
    const address = type === 'depart' ? this.depart : this.arrivee;
    if (!address) return;
  
    try {
      this.isLoading = true;
      this.errorMessage = null;
  
      const latLng = await this.mapService.geocodeAddress(address);
      if (!latLng) {
        throw new Error('Adresse introuvable');
      }
  
      // Ajouter le marqueur sur la carte
      this.mapService.addMarker(latLng, type === 'depart');
  
      // Si les deux adresses sont renseignées
      if (this.mapService.hasBothMarkers()) {
        await this.updateDistanceAndCarbon();
        this.adjustMapZoom(); // Ajuster le zoom après le calcul
      }
    } catch (error) {
      this.handleError(error instanceof Error ? error.message : 'Erreur lors du traitement de l\'adresse');
    } finally {
      this.isLoading = false;
    }
  }

  async updateDistanceAndCarbon(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = null;
      
      // Calculer la distance
      this.distance = await this.mapService.calculateDistance();
      
      // Calculer l'empreinte carbone
      this.carbonFootprint = this.distance * this.emissionFactors[this.transportType];
    } catch (error) {
      this.handleError('Erreur lors du calcul de la distance ou de l\'empreinte carbone');
    } finally {
      this.isLoading = false;
    }
  }

  handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(message);
  }

  saveFootprint(): void {
    if (!this.distance || !this.carbonFootprint) {
      this.handleError('Veuillez d\'abord calculer une empreinte carbone');
      return;
    }

    const data = {
      distance: this.distance,
      transportType: this.transportType,
      carbonFootprint: this.carbonFootprint,
      date: new Date()
    };

    this.subscriptions.add(
      this.carbonService.saveFootprint(data).subscribe({
        next: () => alert('Empreinte carbone enregistrée avec succès !'),
        error: () => this.handleError('Erreur lors de l\'enregistrement')
      })
    );
  }

  clearMarkers(): void {
    this.mapService.clearMarkers();
    this.distance = 0;
    this.carbonFootprint = 0;
    this.depart = '';
    this.arrivee = '';
  }
}