import { Component, OnInit } from '@angular/core';
import { MonumentService } from 'src/app/core/services/monument.service';
import { Monument } from 'src/app/core/models/monument';

@Component({
  selector: 'app-monument-front',
  templateUrl: './monument-front.component.html',
  styleUrls: ['./monument-front.component.scss']
})
export class MonumentFrontComponent implements OnInit {
  monuments: Monument[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private monumentService: MonumentService) {}

  ngOnInit(): void {
    this.loadMonuments();
  }

  loadMonuments(): void {
    this.isLoading = true;
    this.monumentService.getAllMonuments().subscribe({
      next: (data) => {
        this.monuments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Impossible de charger les monuments. Veuillez réessayer.";
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default.jpg';
  }
}
