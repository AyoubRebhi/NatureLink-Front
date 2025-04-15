import { Component, OnInit } from '@angular/core';
import { LogementService } from 'src/app/core/services/logement.service';
import { Logement } from 'src/app/core/models/logement.model';

@Component({
  selector: 'app-logement-list-front',
  templateUrl: './logement-list-front.component.html',
  styleUrls: ['./logement-list-front.component.scss']
})
export class LogementListFrontComponent implements OnInit {
  logements: Logement[] = [];
  currentImageIndex: { [logementId: number]: number } = {}; // To track current image for each logement

  constructor(private logementService: LogementService) {}

  ngOnInit(): void {
    this.loadLogements();
  }

  loadLogements(): void {
    this.logementService.getAllLogements().subscribe({
      next: (data) => {
        this.logements = data;
        // Initialize current image index for each logement
        this.logements.forEach(logement => {
          if (logement.id !== undefined && logement.images?.length) {
            this.currentImageIndex[logement.id] = 0; // Default to first image
          }
        });
      },
      error: (err) => console.error('Error loading logements:', err)
    });
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
