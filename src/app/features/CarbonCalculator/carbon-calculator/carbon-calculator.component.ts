import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MapService } from '../../../core/services/map.service';
import { CarbonFootprintService } from '../../../core/services/footprint.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-carbon-calculator',
  templateUrl: './carbon-calculator.component.html',
  styleUrls: ['./carbon-calculator.component.scss']
})
export class CarbonCalculatorComponent implements AfterViewInit, OnDestroy {
  showHistoryModal: boolean = false;
  userFootprints: any[] = [];
  isLoadingHistory: boolean = false;
  historyError: string | null = null;
  distance: number = 0;
  loggedInUserId?: number; // Set dynamically from AuthService
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
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Set userId from AuthService
    this.loggedInUserId = this.authService.getCurrentUserId() || undefined;
    if (!this.loggedInUserId) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

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

        // Déterminer quel marqueur mettre à jour
        let targetField: 'depart' | 'arrivee';
        if (!this.depart && !this.arrivee) {
          targetField = 'depart';
        } else if (this.depart && !this.arrivee) {
          targetField = 'arrivee';
        } else {
          const replaceDepart = confirm('Voulez-vous modifier le point de départ? (OK pour départ, Annuler pour arrivée)');
          targetField = replaceDepart ? 'depart' : 'arrivee';
        }

        // Supprimer l'ancien marqueur avant d'ajouter le nouveau
        this.mapService.removeMarker(targetField === 'depart');

        const address = await this.mapService.reverseGeocode(e.latlng);
        if (!address) {
          throw new Error('Impossible de trouver une adresse pour cet emplacement');
        }

        // Mettre à jour l'adresse et ajouter le nouveau marqueur
        if (targetField === 'depart') {
          this.depart = address;
        } else {
          this.arrivee = address;
        }

        this.mapService.addMarker(e.latlng, targetField === 'depart');

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

      const startLatLng = this.mapService.getStartLatLng();
      const endLatLng = this.mapService.getEndLatLng();

      if (!startLatLng || !endLatLng) {
        throw new Error('Coordonnées de départ ou d\'arrivée invalides');
      }

      this.distance = startLatLng.distanceTo(endLatLng);
      this.carbonFootprint = (this.distance * this.emissionFactors[this.transportType]) / 1000; // en kg CO2
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

  saveFootprint(): void {
    if (!this.loggedInUserId) {
      this.handleError('Veuillez vous connecter pour enregistrer une empreinte carbone.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (!this.distance || !this.carbonFootprint) {
      this.handleError('Veuillez d\'abord calculer une empreinte carbone');
      return;
    }

    if (!this.depart || !this.arrivee) {
      this.handleError('Veuillez spécifier les points de départ et d\'arrivée');
      return;
    }

    const data = {
      distance: this.distance / 1000,
      transportType: this.transportType,
      carbonFootprint: this.carbonFootprint,
      departurePoint: this.depart,
      arrivalPoint: this.arrivee,
      user: { id: this.loggedInUserId },
      date: new Date()
    };

    this.subscriptions.add(
      this.carbonService.saveFootprint(data).subscribe({
        next: () => {
          this.successMessage = 'Empreinte carbone enregistrée avec succès !';
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          console.error('Erreur détaillée:', err);
          this.handleError(err.error?.message || 'Erreur lors de l\'enregistrement');
        }
      })
    );
  }

  openHistoryModal(): void {
    if (!this.loggedInUserId) {
      this.handleError('Veuillez vous connecter pour voir l\'historique.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.showHistoryModal = true;
    this.loadUserFootprints();
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
  }

  loadUserFootprints(): void {
    if (!this.loggedInUserId) {
      this.historyError = 'Veuillez vous connecter pour voir l\'historique.';
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.isLoadingHistory = true;
    this.historyError = null;

    this.carbonService.getFootprintsByUser(this.loggedInUserId).subscribe({
      next: (footprints) => {
        this.userFootprints = footprints;
        this.isLoadingHistory = false;
      },
      error: (err) => {
        this.historyError = 'Erreur lors du chargement de l\'historique';
        this.isLoadingHistory = false;
        console.error(err);
      }
    });
  }

  formatDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  public resetUpload(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isUploading = false;
    this.uploadProgress = null;
    this.selectedFile = null;
    this.previewUrl = null;
  }
}