import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MapService } from '../../../core/services/map.service';
import { CarbonFootprintService } from '../../../core/services/footprint.service';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { HttpClient, HttpEventType } from '@angular/common/http';

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
  successMessage: string | null = null;
  depart: string = '';
  arrivee: string = '';
  private subscriptions: Subscription = new Subscription();

  // Upload properties
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  isUploading: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;

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
    private carbonService: CarbonFootprintService,
    private http: HttpClient
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.mapService.clearMap();
  }

  private initMap(): void {
    try {
      this.mapService.initMap('map', 36.8065, 10.1815); // Tunis
      this.setupMapClickHandler();
    } catch (error) {
      this.handleError('Erreur lors de l\'initialisation de la carte');
    }
  }

  private setupMapClickHandler(): void {
    const map = this.mapService.getMap();
    if (!map) return;
  
    map.on('click', async (e: L.LeafletMouseEvent) => {
      try {
        this.isLoading = true;
        
        let targetField: 'depart' | 'arrivee';
        if (!this.depart && !this.arrivee) {
          targetField = 'depart';
        } else if (this.depart && !this.arrivee) {
          targetField = 'arrivee';
        } else {
          const replaceDepart = confirm('Voulez-vous remplacer le point de départ? (OK pour départ, Annuler pour arrivée)');
          targetField = replaceDepart ? 'depart' : 'arrivee';
        }
  
        const address = await this.mapService.reverseGeocode(e.latlng);
        if (!address) {
          throw new Error('Impossible de trouver une adresse pour cet emplacement');
        }
  
        if (targetField === 'depart') {
          this.depart = address;
        } else {
          this.arrivee = address;
        }
  
        await this.onAddressChange(targetField);
      } catch (error) {
        this.handleError(error instanceof Error ? error.message : 'Erreur lors du clic sur la carte');
      } finally {
        this.isLoading = false;
      }
    });
  }

  private adjustMapZoom(): void {
    const map = this.mapService.getMap();
    const startLatLng = this.mapService.getStartLatLng();
    const endLatLng = this.mapService.getEndLatLng();
    
    if (!map || !startLatLng || !endLatLng) return;
  
    const distance = startLatLng.distanceTo(endLatLng);
    let zoomLevel: number;
    
    if (distance > 100000) zoomLevel = 7;
    else if (distance > 50000) zoomLevel = 9;
    else if (distance > 20000) zoomLevel = 11;
    else if (distance > 10000) zoomLevel = 12;
    else if (distance > 5000) zoomLevel = 13;
    else zoomLevel = 14;
  
    const bounds = L.latLngBounds([startLatLng, endLatLng]);
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: zoomLevel
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
  
      this.mapService.addMarker(latLng, type === 'depart');
  
      if (this.mapService.hasBothMarkers()) {
        await this.updateDistanceAndCarbon();
        this.adjustMapZoom();
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
      
      this.distance = await this.mapService.calculateDistance();
      this.carbonFootprint = this.distance * this.emissionFactors[this.transportType];
    } catch (error) {
      this.handleError('Erreur lors du calcul de la distance ou de l\'empreinte carbone');
    } finally {
      this.isLoading = false;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.handleError('Type de fichier non supporté. Formats acceptés : JPEG, PNG, PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.handleError('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    this.selectedFile = file;
    this.errorMessage = null;

    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  uploadTicket(): void {
    if (!this.selectedFile) {
      this.handleError('Veuillez sélectionner un fichier');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = null;
    this.successMessage = null;

    const formData = new FormData();
    formData.append('ticket', this.selectedFile);

    this.subscriptions.add(
      this.http.post('http://localhost:5000/api/process-ticket', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.handleTicketResponse(event.body);
          }
        },
        error: (err) => {
          this.handleError(err.error?.message || 'Erreur lors du traitement du ticket');
          this.resetUpload();
        }
      })
    );
  }

  handleTicketResponse(data: any): void {
    this.isUploading = false;
    this.uploadProgress = null;

    if (data.success) {
        // Nettoyage supplémentaire côté client si nécessaire
        const cleanDeparture = data.departure.replace(/[^a-zA-Z\s]/g, '').trim();
        const cleanDestination = data.destination.replace(/[^a-zA-Z\s]/g, '').trim();
        
        this.depart = cleanDeparture;
        this.arrivee = cleanDestination;
        
        // Mise à jour des champs et de la carte
        this.onAddressChange('depart');
        this.onAddressChange('arrivee');
    } else {
        this.handleError(data.message || 'Impossible d\'extraire les informations du ticket');
    }
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
        next: () => {
          this.successMessage = 'Empreinte carbone enregistrée avec succès !';
          setTimeout(() => this.successMessage = null, 30);
        },
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
    this.resetUpload();
  }

  
  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(message);
    setTimeout(() => this.errorMessage = null, 5000);
  }

  // carbon-calculator.component.ts
public resetUpload(event?: Event): void {
  if (event) {
    event.stopPropagation(); // Important pour éviter de déclencher le clic sur le parent
  }
  this.isUploading = false;
  this.uploadProgress = null;
  this.selectedFile = null;
  this.previewUrl = null;
}
}