import { Component, OnInit } from '@angular/core';
import { Destination } from '../../../model/Destination.model';
import { Clothing } from '../../../model/Clothing.model';
import { Food } from '../../../model/Food.model';
import { DestinationService } from '../../../services/destination.service';
import { ClothingService } from '../../../services/clothing.service';
import { FoodService } from '../../../services/food.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-food-clothingfront',
  templateUrl: './list-food-clothingfront.component.html',
  styleUrls: ['./list-food-clothingfront.component.scss']
})
export class ListFoodClothingfrontComponent implements OnInit {
  destinations: Destination[] = [];
  selectedDestinationId: number = 0; // Initialisé avec une valeur par défaut
  clothingItems: Clothing[] = [];
  foodItems: Food[] = [];
  isLoading = false;

  constructor(
    private destinationService: DestinationService,
    private clothingService: ClothingService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.destinationService.getAllDestinations().subscribe({
      next: (destinations) => {
        this.destinations = destinations;
        if (destinations.length > 0 && destinations[0].id) {
          this.selectDestination(destinations[0].id);
        }
      },
      error: (err) => console.error('Failed to load destinations', err)
    });
  }

  selectDestination(destinationId: number): void {
    if (!destinationId) {
      console.error('Invalid destination ID');
      return;
    }
    
    this.selectedDestinationId = destinationId;
    this.loadItemsForDestination(destinationId);
  }

  loadItemsForDestination(destinationId: number): void {
    this.isLoading = true;
    
    // Reset items
    this.clothingItems = [];
    this.foodItems = [];

    // Load clothing items
    this.clothingService.getClothingByDestination(destinationId).subscribe({
      next: (clothing) => {
        this.clothingItems = clothing;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load clothing', err);
        this.isLoading = false;
      }
    });

    // Load food items
    this.foodService.getFoodsByDestination(destinationId).subscribe({
      next: (food) => {
        this.foodItems = food;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load food', err);
        this.isLoading = false;
      }
    });
  }
}