import { Component, OnInit } from '@angular/core';
import { LogementService } from '../../../../core/services/logement.service';
import { Logement } from '../../../../core/models/logement.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LogementType } from '../../../../core/models/logement.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FavoriteService } from 'src/app/core/services/favorite.service';

@Component({
  selector: 'app-logement-list-front',
  templateUrl: './logement-list-front.component.html',
  styleUrls: ['./logement-list-front.component.scss']
})
export class LogementListFrontComponent implements OnInit {
  logements: Logement[] = [];
  filteredLogements: Logement[] = [];
  currentImageIndex: { [logementId: number]: number } = {};
  selectedLogementForMap: Logement | null = null;
  mapUrl: SafeResourceUrl | null = null;
  searchQuery: string = '';
  selectedType: string = '';
  notificationDistanceLimit = 100;
  userLatitude: number | null = null;
  userLongitude: number | null = null;
  showNotif: boolean = true;
  notifications: Logement[] = [];
  logementTypes = Object.values(LogementType);
  uploadedImage: File | null = null;
  searchResults: Logement[] = [];
  imageFiles: File[] = [];
  imagePreviews: string[] = [];
  userId: number | null = null;
  favorites: Set<number> = new Set();
  showFavoritesModal: boolean = false;
  favoriteLogements: Logement[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private logementService: LogementService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private favoriteService: FavoriteService
  ) {}

    ngOnInit(): void {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url }
        });
        return;
      }
    
      this.userId = this.authService.getCurrentUserId();
      if (this.userId != null) {
        this.loadFavorites(); // Load favorites when component initializes
      }

    this.userId = this.authService.getCurrentUserId();
    if (this.userId != null) {
      this.favoriteService.getFavorites(this.userId).subscribe({
        next: (favorites) => {
          // Store the favorite logement IDs in a set
          this.favorites = new Set(favorites.map(fav => fav.logementId));
        },
        error: (err) => console.error('Error loading favorites:', err),
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;
        this.loadLogements();
      },
      (error) => {
        console.error('Geolocation error:', error);
        this.loadLogements();
      }
    );
  }
  loadFavorites(): void {
    this.favoriteService.getFavorites(this.userId!).subscribe({
      next: (favorites) => {
        this.favorites = new Set(favorites.map(fav => fav.logementId));
      },
      error: (err) => console.error('Error loading favorites:', err),
    });
  }

isFavorite(logementId: number | undefined): boolean {
  if (!logementId) return false;
  return this.favorites.has(logementId);
}
toggleFavorite(logementId: number | undefined): void {
  if (logementId === undefined || this.userId == null) return;

  if (this.isFavorite(logementId)) {
    this.favoriteService.removeFavorite(this.userId, logementId).subscribe({
      next: () => {
        this.favorites.delete(logementId);
      },
      error: (err) => console.error('Error removing favorite:', err)
    });
  } else {
    this.favoriteService.addFavorite(this.userId, logementId).subscribe({
      next: () => {
        this.favorites.add(logementId);
      },
      error: (err) => console.error('Error adding favorite:', err)
    });
  }
}
  // Method to load the favorite logements
  loadFavoriteLogements(): void {
    if (!this.userId) return;
  
    this.favoriteService.getFavorites(this.userId).subscribe({
      next: (favorites) => {
        this.favoriteLogements = favorites.map(fav => fav.logement);
        
        this.favoriteLogements.forEach(l => {
          if (l.id !== undefined) {
            this.currentImageIndex[l.id] = 0;
          }
        });
  
        this.showFavoritesModal = true;
      },
      error: (err) => {
        console.error('Error fetching favorites:', err);
      }
    });
  }
  

  loadLogements(): void {
    this.logementService.getAllLogements().subscribe({
      next: async (data) => {
        this.logements = data;

        for (const logement of this.logements) {
          if (!logement.latitude || !logement.longitude) {
            const coords = await this.getCoordinatesFromLocation(logement.location || '');
            if (coords) {
              logement.latitude = coords.lat;
              logement.longitude = coords.lng;
            }
          }
        }

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
    // Text search filter
    const matchesQuery =
      logement.titre?.toLowerCase().includes(query) ||
      logement.location?.toLowerCase().includes(query);
    
    // Type filter
    const matchesType =
      !this.selectedType || logement.type === this.selectedType;
    
    // Price range filter
    const matchesPrice = this.matchesPriceRange(logement.price);
    
    return matchesQuery && matchesType && matchesPrice;
  });
}
// Add this helper method to check price range
private matchesPriceRange(price: number | undefined): boolean {
  if (price === undefined) return false;
  
  // If no price filters are set, include all logements
  if (this.minPrice === null && this.maxPrice === null) {
    return true;
  }
  
  // Check min price
  if (this.minPrice !== null && price < this.minPrice) {
    return false;
  }
  
  // Check max price
  if (this.maxPrice !== null && price > this.maxPrice) {
    return false;
  }
  
  return true;
}

  bookLogement(logementId: number): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.router.navigate(['/reservation/create'], {
      queryParams: { type: 'LOGEMENT', id: logementId }
    });
  }

  onImagesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.imageFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews = [reader.result as string];
      };
      reader.readAsDataURL(file);
      this.searchByImage(file);
    }
  }

  searchByImage(file: File): void {
    const formData = new FormData();
    formData.append('image', file, file.name);

    this.http.post<any>('http://localhost:5000/search', formData).subscribe({
      next: (response) => {
        if (response.matches && response.matches.length > 0) {
          const imageNames: string[] = response.matches.map((match: any) => match.image_name);
          let params = new HttpParams();
          imageNames.forEach(name => {
            params = params.append('imageNames', name);
          });
          this.http.get<Logement[]>(
            'http://localhost:9000/logements/searchByImages',
            { params }
          ).subscribe({
            next: (logements) => {
              this.filteredLogements = logements;
            },
            error: (err) => {
              console.error('Error fetching logements by images:', err);
            }
          });
        } else {
          this.filteredLogements = [];
        }
      },
      error: (err) => {
        console.error('Error searching for similar images:', err);
      },
    });
  }

  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
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
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=YOUR_GOOGLE_MAPS_API_KEY`;
    return this.http.get<any>(url).toPromise().then(response => {
      if (response.status === 'OK' && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      return null;
    }).catch(() => null);
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