import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logement } from 'src/app/core/models/logement.model';
import { LogementService } from 'src/app/core/services/logement.service';

@Component({
  selector: 'app-logement-list-user',
  templateUrl: './logement-list-user.component.html',
  styleUrls: ['./logement-list-user.component.scss']
})
export class LogementListUserComponent implements OnInit, OnDestroy {
  logements: Logement[] = [];
  currentImageIndex: { [key: number]: number } = {}; // Track current image index for each logement
  imageInterval: any; // Store interval for auto-play

  constructor(private logementService: LogementService) {}

  ngOnInit(): void {
    this.loadLogements();
  }

  loadLogements(): void {
    this.logementService.getLogementsByUser().subscribe({
      next: (data) => {
        this.logements = data;
        // Initialize image index for each logement
        this.logements.forEach(logement => {
          this.currentImageIndex[logement.id!] = 0;
        });
        this.startAutoPlay(); // Start auto-play for images
      },
      error: (err) => console.error('Error loading logements:', err)
    });
  }

  deleteLogement(id: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this logement?');
    if (confirmed) {
      this.logementService.deleteLogement(id).subscribe({
        next: () => {
          this.logements = this.logements.filter(logement => logement.id !== id);
          alert('Logement deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting logement:', err);
          alert('An error occurred while deleting the logement.');
        }
      });
    }
  }

  prevSlide(logementId: number, totalImages: number): void {
    this.currentImageIndex[logementId] = (this.currentImageIndex[logementId] - 1 + totalImages) % totalImages;
  }

  nextSlide(logementId: number, totalImages: number): void {
    this.currentImageIndex[logementId] = (this.currentImageIndex[logementId] + 1) % totalImages;
  }

  startAutoPlay(): void {
    this.imageInterval = setInterval(() => {
      this.logements.forEach(logement => {
        const totalImages = logement.images?.length || 0;
        if (totalImages > 0) {
          this.currentImageIndex[logement.id!] = (this.currentImageIndex[logement.id!] + 1) % totalImages;
        }
      });
    }, 3000); // Change image every 3 seconds
  }

  ngOnDestroy(): void {
    if (this.imageInterval) {
      clearInterval(this.imageInterval); // Clean up interval on component destroy
    }
  }
}
