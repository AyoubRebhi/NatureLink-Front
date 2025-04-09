import { Component, OnInit } from '@angular/core';
import { Food } from '../../../model/Food.model';
import { Destination } from '../../../model/Destination.model';
import { FoodService } from '../../../services/food.service';
import { DestinationService } from '../../../services/destination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-food',
  templateUrl: './update-food.component.html',
  styleUrls: ['./update-food.component.scss']
})
export class UpdateFoodComponent implements OnInit {
  foodForm: FormGroup;
  foodId!: number;
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
    private foodService: FoodService,
    private destinationService: DestinationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.foodForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      season: ['', Validators.required],
      destinationId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.foodId = +this.route.snapshot.paramMap.get('id')!;
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.loadingDestinations = true;
    this.destinationService.getAllDestinations().subscribe({
      next: (destinations) => {
        this.destinations = destinations;
        this.loadingDestinations = false;
        this.loadFood();
      },
      error: (err) => {
        this.errorMessage = 'Échec du chargement des destinations';
        this.loadingDestinations = false;
        console.error('Erreur:', err);
      }
    });
  }

  loadFood(): void {
    this.isLoading = true;
    this.foodService.getFoodById(this.foodId).subscribe({
      next: (food) => {
        this.currentImageUrl = food.imageUrl || null;
        this.previewUrl = this.currentImageUrl;
        
        this.foodForm.patchValue({
          name: food.nom,
          description: food.description,
          season: food.season,

          destinationId: food.destinationId || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Échec du chargement des détails de l\'aliment';
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
    if (this.foodForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { name, description, season, destinationId } = this.foodForm.value;

    this.foodService.updateFoodWithImage(
      this.foodId,
      name,
      description,
      season,
      destinationId,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.router.navigate(['/admin/FoodList']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Échec de la mise à jour de l\'aliment';
        this.isLoading = false;
        console.error('Erreur complète:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/foods']);
  }
}