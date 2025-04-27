import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../core/services/activity.service';
import { Activity } from '../../core/models/activity.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  pagedActivities: Activity[] = [];
  isLoading = false;
  isRecommendationMode = false;
  recommendationError: string | null = null;
  showRecommendationForm = false;
  moodInput = '';
  currentPage = 1;
  itemsPerPage = 3;

  constructor(private activityService: ActivityService, private router: Router) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = this.processActivities(data);
        this.filteredActivities = [...this.activities];
        this.updatePagedActivities();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading activities:', err);
        this.isLoading = false;
        this.recommendationError = 'Failed to load activities. Please try again later.';
      }
    });
  }

  updatePagedActivities(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedActivities = this.filteredActivities.slice(startIndex, endIndex);
    // Reset to page 1 if current page exceeds total pages after filtering
    if (this.pagedActivities.length === 0 && this.currentPage > 1) {
      this.currentPage = 1;
      this.updatePagedActivities();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredActivities.length / this.itemsPerPage);
  }

  getPagesArray(): number[] {
    return Array.from({length: this.getTotalPages()}, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePagedActivities();
    }
  }

  getRecommendations(): void {
    if (!this.moodInput.trim()) {
      this.recommendationError = 'Please describe what you\'re looking for';
      return;
    }

    this.isLoading = true;
    this.recommendationError = null;
    this.currentPage = 1; // Reset to first page when getting new recommendations

    this.activityService.recommendFromAllActivities(this.moodInput).subscribe({
      next: (recommendations) => {
        this.filteredActivities = recommendations.map(recommendation => {
          const fullActivity = this.activities.find(a => a.id === recommendation.id) || recommendation;
          return {
            ...fullActivity,
            similarity: recommendation.similarity
          };
        });
        
        this.isRecommendationMode = true;
        this.updatePagedActivities();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Recommendation failed:', err);
        this.recommendationError = 'Could not get recommendations. Please try again.';
        this.isLoading = false;
      }
    });
  }

  resetRecommendations(): void {
    this.filteredActivities = [...this.activities];
    this.isRecommendationMode = false;
    this.moodInput = '';
    this.showRecommendationForm = false;
    this.recommendationError = null;
    this.currentPage = 1;
    this.updatePagedActivities();
  }

  bookActivity(activityId: number): void {
    this.router.navigate(['/reservation/create'], {
      queryParams: { type: 'ACTIVITE', id: activityId }
    });
  }

  private processActivities(activities: any[]): Activity[] {
    if (!activities) return [];

    return activities.map(activity => {
      const processField = (field: any) => {
        if (Array.isArray(field)) return field;
        if (typeof field === 'string' && field.includes(',')) {
          return field.split(',').map(item => item.trim());
        }
        return field ? [field] : [];
      };

      return {
        ...activity,
        imageUrls: activity.imageUrls?.length ? 
          (Array.isArray(activity.imageUrls) ? activity.imageUrls : [activity.imageUrls]) :
          ['assets/img/bg-hero.jpg'],
        mood: processField(activity.mood),
        tags: processField(activity.tags),
        requiredEquipment: processField(activity.requiredEquipment)
      };
    });
  }
}