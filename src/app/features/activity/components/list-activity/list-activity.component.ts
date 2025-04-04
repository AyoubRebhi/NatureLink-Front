import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../../../core/services/activity.service';
import { Activity } from '../../../../core/models/activity.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-activity',
  templateUrl: './list-activity.component.html',
  styleUrls: ['./list-activity.component.scss']
})
export class ListActivityComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  searchTerm: string = '';

  constructor(
    private activityService: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.filteredActivities = data;
      },
      error: (err) => {
        console.error('Error fetching activities:', err);
      }
    });
  }

  filterActivities(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredActivities = this.activities.filter(activity =>
      activity.name.toLowerCase().includes(term) ||
      activity.location.toLowerCase().includes(term) ||
      activity.difficultyLevel.toLowerCase().includes(term)
    );
  }

  deleteActivity(id: number): void {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.deleteActivity(id).subscribe({
        next: () => {
          this.activities = this.activities.filter(a => a.id !== id);
          this.filterActivities(); // refresh filtered list
          alert('Activity deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting activity:', err);
          alert('Failed to delete activity.');
        }
      });
    }
  }
  getDifficultyColor(level: string): string {
    switch (level.toLowerCase()) {
      case 'hard':
        return '#750000';
      case 'moderate':
        return '#DA8541';
      case 'easy':
        return '#4B974B';
      default:
        return '#6c757d'; // default Bootstrap secondary gray
    }
  }
  

  goToEditActivity(id: number): void {
    this.router.navigate(['/admin/activity/edit', id]);
  }
}
