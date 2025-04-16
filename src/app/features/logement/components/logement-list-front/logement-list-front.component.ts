import { Component, OnInit } from '@angular/core';
import { LogementService } from 'src/app/core/services/logement.service';
import { Logement } from 'src/app/core/models/logement.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LogementType } from 'src/app/core/models/logement.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/core/services/websocket.service';


@Component({
  selector: 'app-logement-list-front',
  templateUrl: './logement-list-front.component.html',
  styleUrls: ['./logement-list-front.component.scss']
})
export class LogementListFrontComponent implements OnInit {
  logements: Logement[] = [];
  filteredLogements: Logement[] = [];
  currentImageIndex: { [logementId: number]: number } = {}; // To track current image for each logement
  selectedLogementForMap: Logement | null = null;
  mapUrl: SafeResourceUrl | null = null;
  searchQuery: string = '';
  selectedType: string = '';
  notificationDistanceLimit = 100; // 5 km
  userLatitude: number | null = null;
  userLongitude: number | null = null;
  showNotif: boolean = true;
  notifications: Logement[] = [];
  logementTypes = Object.values(LogementType); 
  constructor(private logementService: LogementService ,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadLogements();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;
        this.loadLogements(); // Load only after we have location
      },
      (error) => {
        console.error('Geolocation error:', error);
        this.loadLogements(); // Fallback if location fails
      }
    );
  }
  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getCoordinatesFromLocation(location: string): Promise<{ lat: number, lng: number } | null> {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${environment.googleMapsApiKey}`;
  
    return this.http.get<any>(url).toPromise().then(response => {
      if (response.status === 'OK' && response.results.length > 0) {
        const coords = response.results[0].geometry.location;
        return { lat: coords.lat, lng: coords.lng };
      }
      return null;
    }).catch(() => null);
  }
  
  async loadLogements(): Promise<void> {
    this.logementService.getAllLogements().subscribe({
      next: async (data) => {
        this.logements = data;
  
        // Update logements with missing lat/lng
        for (const logement of this.logements) {
          if (!logement.latitude || !logement.longitude) {
            const coords = await this.getCoordinatesFromLocation(logement.location || '');
            if (coords) {
              logement.latitude = coords.lat;
              logement.longitude = coords.lng;
            }
            console.log('Geocoded coords for logement', logement.titre, coords);
          }
        }
  
        // Distance-based notifications
        this.notifications = this.logements.filter((logement) => {
          if (
            logement.latitude != null &&
            logement.longitude != null &&
            this.userLatitude != null &&
            this.userLongitude != null
          ) {
            const distance = this.getDistanceFromLatLonInKm(
              this.userLatitude,
              this.userLongitude,
              logement.latitude,
              logement.longitude
            );
            return distance <= this.notificationDistanceLimit;
          }
          return false;
        });
  
        this.filteredLogements = [...this.logements];
  
        // Init image indices
        this.logements.forEach((logement) => {
          if (logement.id !== undefined && logement.images?.length) {
            this.currentImageIndex[logement.id] = 0;
          }
        });
      },
      error: (err) => console.error('Error loading logements:', err),
    });
  }
  

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredLogements = this.logements.filter((logement) => {
      const matchesQuery =
        logement.titre?.toLowerCase().includes(query) ||
        logement.location?.toLowerCase().includes(query);
      const matchesType =
        !this.selectedType || logement.type === this.selectedType;

      return matchesQuery && matchesType;
    });
  }
  
  showLocationMap(logement: Logement): void {
    const locationQuery = encodeURIComponent(logement.location || '');
   const url = `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=${locationQuery}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.selectedLogementForMap = logement;
  }

  closeMapPopup(): void {
    this.selectedLogementForMap = null;
    this.mapUrl = null;
  }


  prevSlide(logementId: number, totalImages: number): void {
    if (this.currentImageIndex[logementId] > 0) {
      this.currentImageIndex[logementId]--;
    } else {
      this.currentImageIndex[logementId] = totalImages - 1;
    }
  }
  
  nextSlide(logementId: number, totalImages: number): void {
    if (this.currentImageIndex[logementId] < totalImages - 1) {
      this.currentImageIndex[logementId]++;
    } else {
      this.currentImageIndex[logementId] = 0;
    }
  }
  
}
