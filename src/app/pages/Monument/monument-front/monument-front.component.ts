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
  showFullDescription: boolean = false;
  expandedIndex: number = -1;


  // Chemin absolu avec vérification de l'extension
  private readonly DEFAULT_IMAGE = '/assets/images/default-monument.jpg';


  constructor(private monumentService: MonumentService) {}


  ngOnInit(): void {
    this.loadMonuments();
  }


  loadMonuments(): void {
    this.isLoading = true;
    this.errorMessage = null;


    this.monumentService.getAllMonuments().subscribe({
      next: (data) => {
        this.monuments = data.map(monument => ({
          ...monument,
          // Ajout d'un cache buster pour les images
          image: monument.image ? `${monument.image}?t=${new Date().getTime()}` : undefined
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Impossible de charger les monuments. Veuillez réessayer plus tard.";
        console.error('Erreur de chargement:', err);
        this.isLoading = false;
      }
    });
  }


  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Double vérification pour éviter les boucles infinies
    if (!img.src.includes(this.DEFAULT_IMAGE)) {
      img.src = this.DEFAULT_IMAGE;
      img.onerror = null; // Désactive les futurs erreurs pour cette image
    }
  }


  getImageUrl(imageName?: string | null): string {
    // Si pas d'image ou nom vide, retourne l'image par défaut
    if (!imageName || imageName.trim() === '') {
      return this.DEFAULT_IMAGE;
    }


    // Si c'est déjà une URL complète (http/https/data)
    if (/^(http|https|data):/i.test(imageName)) {
      return imageName;
    }


    // Construction de l'URL avec cache buster
    const cacheBuster = `?t=${new Date().getTime()}`;
    return `${this.monumentService.getImage(imageName)}${cacheBuster}`;
  }
}
