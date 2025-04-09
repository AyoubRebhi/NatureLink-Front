import { Component, OnInit } from '@angular/core';
import { Clothing } from '../../../model/Clothing.model';
import { Destination } from '../../../model/Destination.model';
import { ClothingService } from '../../../services/clothing.service';
import { DestinationService } from '../../../services/destination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-clothing',
  templateUrl: './update-clothing.component.html',
  styleUrls: ['./update-clothing.component.scss']
})
export class UpdateClothingComponent implements OnInit {
  clothingForm: FormGroup;
  clothingId!: number;
  isLoading = false;
  loadingDestinations = false;
  errorMessage: string | null = null;
  seasons = ['Printemps', 'Été', 'Automne', 'Hiver'];
  destinations: Destination[] = [];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  currentImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clothingService: ClothingService,
    private destinationService: DestinationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clothingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      season: ['', Validators.required],
      destinationId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clothingId = +this.route.snapshot.paramMap.get('id')!;
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.loadingDestinations = true;
    this.destinationService.getAllDestinations().subscribe({
      next: (destinations) => {
        this.destinations = destinations;
        this.loadingDestinations = false;
        this.loadClothing();
      },
      error: (err) => {
        this.errorMessage = 'Échec du chargement des destinations';
        this.loadingDestinations = false;
        console.error('Erreur:', err);
      }
    });
  }

  loadClothing(): void {
    this.isLoading = true;
    this.clothingService.getClothingById(this.clothingId).subscribe({
      next: (clothing) => {
        this.currentImageUrl = clothing.imageUrl || null;
        this.previewUrl = this.currentImageUrl;
        
        this.clothingForm.patchValue({
          name: clothing.name,
          description: clothing.description,
          season: clothing.season,
          destinationId: clothing.destinationId || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Échec du chargement des détails du vêtement';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.previewUrl = this.currentImageUrl;
    }
  }

  onSubmit(): void {
    if (this.clothingForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { name, description, season, destinationId } = this.clothingForm.value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('season', season);
    formData.append('destinationId', destinationId.toString());
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.clothingService.updateClothing(this.clothingId, formData).subscribe({
      next: () => {
        this.router.navigate(['/admin/ClothingList']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Échec de la mise à jour du vêtement';
        this.isLoading = false;
        console.error('Erreur complète:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/clothing']);
  }
}