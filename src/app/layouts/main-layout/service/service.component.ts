import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {
  constructor(private router: Router) {}

  services = [
    {
      icon: 'fa-user',
      title: 'Event Management',
      description: 'Comprehensive event planning and coordination services for all your travel needs.',
    },
    {
      icon: 'fa-hotel',
      title: 'House Reservation',
      description: 'Easy booking and management of vacation rentals and holiday accommodations.',
    },
    {
      icon: 'fa-bus',
      title: 'Transportation',
      description: 'Reliable transport solutions with schedules, routes, and competitive pricing.',
    },
    {
      icon: 'fa-map',
      title: 'Travel Guides',
      description: 'Expert local guides and curated itineraries for unforgettable experiences.',
    }
  ];
  navigateToService(service: any) {
    if (service.title === 'Event Management') {
      this.router.navigate(['/events/management']);
    }
  }
}
