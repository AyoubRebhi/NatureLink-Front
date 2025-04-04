import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../../../../core/services/activity.service';
import { Activity } from '../../../../core/models/activity.model';

@Component({
  selector: 'app-details-activity',
  templateUrl: './details-activity.component.html',
  styleUrls: ['./details-activity.component.scss']
})
export class DetailsActivityComponent implements OnInit {
  activity!: Activity;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (!param || isNaN(+param)) {
      alert('Invalid activity ID');
      this.router.navigate(['/admin/activity']);
      return;
    }

    this.id = +param;
    this.loadActivity();
  }

  loadActivity(): void {
    this.activityService.getActivityById(this.id).subscribe({
      next: (data) => {
        this.activity = data;
      },
      error: (err) => {
        console.error('Error loading activity:', err);
        alert('Failed to load activity.');
        this.router.navigate(['/admin/activity']);
      }
    });
  }

  deleteActivity(): void {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.deleteActivity(this.id).subscribe({
        next: () => {
          alert('Activity deleted successfully!');
          this.router.navigate(['/admin/activity']);
        },
        error: (err) => {
          console.error('Error deleting activity:', err);
          alert('Failed to delete activity.');
        }
      });
    }
  }
}
