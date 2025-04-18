import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../core/services/activity.service';
import { Activity } from '../../core/models/activity.model';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  activities: Activity[] = [];
  recommendedActivities: Activity[] = [];

  showRecommendationForm: boolean = false;
  moodInput: string = '';

  constructor(private activityService: ActivityService) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.activityService.getAllActivities().subscribe({
      next: (data: Activity[]) => {
        this.activities = data.map(activity => ({
          ...activity,
          imageUrls: activity.imageUrls?.length ?
            activity.imageUrls :
            ['assets/img/bg-hero.jpg']
        }));
      },
      error: (err) => console.error('Error loading activities:', err)
    });
  }

  getRecommendations(): void {
    if (!this.moodInput.trim()) return;
  
    this.activityService.recommendActivitiesWithData(this.moodInput, this.activities).subscribe({
      next: (result: any) => {
        try {
          console.log("✅ Raw recommendation result:", result);

          const parsed = typeof result === 'string' ? JSON.parse(result) : result;
          this.activities = parsed.map((activity: any) => ({
            ...activity,
            imageUrls: activity.imageUrls?.length
              ? activity.imageUrls
              : ['assets/img/bg-hero.jpg']
          }));
          this.showRecommendationForm = false; // optionally hide the form
        } catch (e) {
          console.error("⚠️ Failed to parse recommendations", e);
        }
      },
      error: (err) => {
        console.error("❌ Recommendation failed", err);
      }
    });
  }
  
  
}
