import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogementService } from '../../../../core/services/logement.service';
import { Logement } from '../../../../core/models/logement.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logement-detail-back',
  templateUrl: './logement-detail-back.component.html',
  styleUrls: ['./logement-detail-back.component.scss']
})
export class LogementDetailBackComponent implements OnInit, OnDestroy {
  logement: Logement | null = null;
  currentImageIndex: number = 0;
  private autoPlayInterval: any;
  safeMapUrl: SafeResourceUrl | null = null;
  mapLoaded: boolean = false;

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
        const query = encodeURIComponent(this.logement.location);
        const url = `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=${query}`;
        this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.mapLoaded = true;
      }

      if (this.logement?.images?.length) {
        this.startAutoPlay();
      }
    });
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
