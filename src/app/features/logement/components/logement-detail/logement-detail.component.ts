import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogementService } from '../../../../core/services/logement.service';
import { Logement } from '../../../../core/models/logement.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logement-detail',
  templateUrl: './logement-detail.component.html',
  styleUrls: ['./logement-detail.component.scss']
})
export class LogementDetailComponent implements OnInit, OnDestroy {
  logement: Logement | null = null;
  currentImageIndex: number = 0;
  private autoPlayInterval: any;
  origin: string = ''; // user's current location
distanceText: string = '';
durationText: string = '';
directionsUrl: SafeResourceUrl | null = null;
  safeMapUrl: SafeResourceUrl | null = null;
  mapLoaded: boolean = false;
  userLatitude: number | null = null;
userLongitude: number | null = null;
showDirectionsCard: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private logementService: LogementService,
    private sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.logementService.getLogementById(id).subscribe((data) => {
      this.logement = data;
  
      if (this.logement?.location) {
        // First show the static map
        const query = encodeURIComponent(this.logement.location);
        const url = `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=${query}`;
        this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.mapLoaded = true;
  
        // Then fetch user's location and directions
        this.getUserLocationAndDirections(this.logement.location);
      }
  
      if (this.logement?.images?.length) {
        this.startAutoPlay();
      }
    });
  }
  getUserLocationAndDirections(destination: string) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.origin = `${position.coords.latitude},${position.coords.longitude}`;
          this.getDirections();
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.warn('Geolocation not supported');
    }
  }
  
  getDirections(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;

        const origin = `${this.userLatitude},${this.userLongitude}`;
        const destination = encodeURIComponent(this.logement?.location || '');

        const mapsUrl = `https://www.google.com/maps/embed/v1/directions?key=${environment.googleMapsApiKey}&origin=${origin}&destination=${destination}&mode=driving`;

        this.directionsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapsUrl);

  
        this.showDirectionsCard = true;
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.autoPlayInterval);
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 3000); // change image every 3 seconds
  }

  nextSlide(): void {
    if (!this.logement?.images) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.logement.images.length;
  }

  prevSlide(): void {
    if (!this.logement?.images) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.logement.images.length) % this.logement.images.length;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }
}
