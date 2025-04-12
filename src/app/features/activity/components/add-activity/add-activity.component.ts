import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '../../../../core/models/activity.model';
import { ActivityService } from '../../../../core/services/activity.service';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent {
  activity: Activity = {
    name: '',
    description: '',
    providerId: 1, // You may later retrieve this from a logged-in user context
    location: '',
    duration: 0,
    price: 0,
    maxParticipants: 0,
    difficultyLevel: '',
    requiredEquipment: [],
    imageUrls: [],
    type: '',
    mood: [],
    tags: []
  };

  equipmentInput: string = '';
  moodInput: string = '';
  tagInput: string = '';
  selectedImages: File[] = [];

  constructor(
    private activityService: ActivityService,
    private router: Router
  ) {}

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = Array.from(input.files);
    }
  }

  onSubmit(): void {
    // Transform comma-separated strings into arrays
    if (this.equipmentInput.trim()) {
      this.activity.requiredEquipment = this.equipmentInput.split(',').map(item => item.trim());
    }

    if (this.moodInput.trim()) {
      this.activity.mood = this.moodInput.split(',').map(item => item.trim());
    }

    if (this.tagInput.trim()) {
      this.activity.tags = this.tagInput.split(',').map(item => item.trim());
    }

    if (!this.selectedImages.length) {
      alert('Please upload at least one image.');
      return;
    }

    const formData = new FormData();

    // Append images
    this.selectedImages.forEach(image => {
      formData.append('images', image);
    });

    // Append activity as JSON blob
    const activityBlob = new Blob([JSON.stringify(this.activity)], { type: 'application/json' });
    formData.append('activity', activityBlob);

    this.activityService.addActivityWithImages(formData).subscribe({
      next: () => {
        alert('Activity added successfully!');
        this.router.navigate(['/admin/activity']);
      },
      error: (err) => {
        console.error('Error adding activity:', err);
        alert('Failed to add activity.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/activity']);
  }

  generateActivity(): void {
    const promptParams = {
      location: this.activity.location || '',
      type: this.activity.type || '',
      difficulty: this.activity.difficultyLevel || '',
      mood: this.moodInput || '',
      tags: this.tagInput || ''
    };
  
    this.activityService.generateActivityFromAI(promptParams).subscribe({
      next: (response) => {
        try {
          const generated = JSON.parse(response.choices[0].message.content);
  
          this.activity.name = generated.name;
          this.activity.description = generated.description;
          this.activity.location = generated.location;
          this.activity.duration = generated.duration;
          this.activity.price = generated.price;
          this.activity.maxParticipants = generated.maxParticipants;
          this.activity.difficultyLevel = generated.difficultyLevel;
          this.activity.requiredEquipment = generated.requiredEquipment;
          this.activity.type = generated.type;
          this.moodInput = generated.mood.join(', ');
          this.tagInput = generated.tags.join(', ');
        } catch (e) {
          alert("⚠️ Failed to parse generated activity. Please try again.");
        }
      },
      error: (err) => {
        console.error("Error generating activity:", err);
        alert("⚠️ Failed to generate activity.");
      }
    });
  }
  
}
