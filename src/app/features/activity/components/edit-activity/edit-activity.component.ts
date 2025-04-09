import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from '../../../../core/models/activity.model';
import { ActivityService } from '../../../../core/services/activity.service';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss']
})
export class EditActivityComponent implements OnInit {
  activity!: Activity;
  id!: number;
  equipmentInput: string = '';
  moodInput: string = ''; // 🌟 NEW
  tagsInput: string = ''; // 🌟 NEW
  selectedImages: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (!param || isNaN(+param)) {
      alert('Invalid activity ID');
      return;
    }

    this.id = +param;
    this.activityService.getActivityById(this.id).subscribe({
      next: (data) => {
        this.activity = data;
        this.equipmentInput = data.requiredEquipment?.join(', ') || '';
        this.moodInput = data.mood?.join(', ') || '';    // 🌟
        this.tagsInput = data.tags?.join(', ') || '';    // 🌟
      },
      error: (err) => {
        console.error('Failed to load activity:', err);
        alert('Failed to load activity.');
      }
    });
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = Array.from(input.files);
    }
  }

  onSubmit(): void {
    // ✅ Transform text inputs into arrays
    if (this.equipmentInput.trim()) {
      this.activity.requiredEquipment = this.equipmentInput.split(',').map(item => item.trim());
    }
    if (this.moodInput.trim()) {
      this.activity.mood = this.moodInput.split(',').map(item => item.trim());
    }
    if (this.tagsInput.trim()) {
      this.activity.tags = this.tagsInput.split(',').map(item => item.trim());
    }

    const formData = new FormData();
    formData.append('activity', new Blob([JSON.stringify(this.activity)], { type: 'application/json' }));

    this.selectedImages.forEach(file => {
      formData.append('images', file);
    });

    this.activityService.updateActivityWithImages(this.id, formData).subscribe({
      next: () => {
        alert('Activity updated successfully!');
        this.router.navigate(['/admin/activity']);
      },
      error: (err) => {
        console.error('Error updating activity:', err);
        alert('Failed to update activity.');
      }
    });
  }

  removeExistingImage(imageUrl: string): void {
    const confirmDelete = confirm('Are you sure you want to remove this image?');
    if (confirmDelete) {
      this.activity.imageUrls = this.activity.imageUrls?.filter(img => img !== imageUrl) || [];
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/activity']);
  }
}
