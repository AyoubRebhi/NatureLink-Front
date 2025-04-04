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
    imageUrls: []
  };

  equipmentInput: string = '';
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
    // Transform equipment string into an array
    if (this.equipmentInput.trim()) {
      this.activity.requiredEquipment = this.equipmentInput.split(',').map(item => item.trim());
    }

    if (!this.selectedImages.length) {
      alert('Please upload at least one image.');
      return;
    }

    const formData = new FormData();

    // Append each image
    this.selectedImages.forEach(image => {
      formData.append('images', image);
    });

    // Append activity data as JSON blob
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
}
