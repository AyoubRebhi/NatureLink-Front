import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogementService } from 'src/app/core/services/logement.service';
import { Logement } from 'src/app/core/models/logement.model';

@Component({
  selector: 'app-logement-detail',
  templateUrl: './logement-detail.component.html',
  styleUrls: ['./logement-detail.component.scss']
})
export class LogementDetailComponent implements OnInit, OnDestroy {
  logement: Logement | null = null;
  currentImageIndex: number = 0;
  private autoPlayInterval: any;

  constructor(
    private route: ActivatedRoute,
    private logementService: LogementService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.logementService.getLogementById(id).subscribe((data) => {
      this.logement = data;

      // Start auto-play after data is loaded
      if (this.logement.images?.length) {
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
