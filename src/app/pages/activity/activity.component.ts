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
  isLoading = false;
  isRecommendationMode = false;
  recommendationError: string | null = null;

  // Recommendation form
  showRecommendationForm = false;
  moodInput = '';

  constructor(private activityService: ActivityService, private router: Router) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = this.processActivities(data);
        this.filteredActivities = [...this.activities];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading activities:', err);
        this.isLoading = false;
      }
    });
  }

  getRecommendations(): void {
    if (!this.moodInput.trim()) {
      this.recommendationError = 'Please describe what you\'re looking for';
      return;
    }
  
    this.isLoading = true;
    this.recommendationError = null;
  
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
  }

  bookActivity(activityId: number): void {
    // Navigate to reservation create with activity ID and type
    this.router.navigate(['/reservation/create'], {
      queryParams: { type: 'ACTIVITE', id: activityId }
    });
  }

  private processActivities(activities: any[]): Activity[] {
    console.log('🔧 Processing activities data...');
    
    return activities.map(activity => {
      console.groupCollapsed(`Processing activity: ${activity.name}`);
      
      const processField = (field: any, fieldName: string) => {
        console.log(`Processing ${fieldName}:`, field);
        
        if (Array.isArray(field)) {
          console.log(`✅ ${fieldName} is already an array`);
          return field;
        }
        if (typeof field === 'string' && field.includes(',')) {
          const result = field.split(',').map(item => item.trim());
          console.log(`🔄 Converted ${fieldName} from string to array:`, result);
          return result;
        }
        if (field) {
          console.log(`⚠️ ${fieldName} is not an array but has value:`, field);
          return [field];
        }
        console.log(`⏩ ${fieldName} is empty, using empty array`);
        return [];
      };
  
      const processedActivity = {
        ...activity,
        imageUrls: activity.imageUrls?.length ? 
          (Array.isArray(activity.imageUrls) ? activity.imageUrls : [activity.imageUrls]) : 
          ['assets/img/bg-hero.jpg'],
        mood: processField(activity.mood, 'mood'),
        tags: processField(activity.tags, 'tags'),
        requiredEquipment: processField(activity.requiredEquipment, 'requiredEquipment')
      };
  
      console.log('Processed activity:', processedActivity);
      console.groupEnd();
      return processedActivity;
    });
  }
}