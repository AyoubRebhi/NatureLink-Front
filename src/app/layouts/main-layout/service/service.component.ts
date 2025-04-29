import { Component } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {
  // service.component.ts
services = [
  {
    icon: 'fa-car',
    title: 'Transport',
    description: 'Choose the perfect vehicle for any trip',
    route: '/transport'
  },
  {
    icon: 'fa-map-marked-alt',
    title: 'Activities',
    description: 'Book curated adventures based on your mood',
    route: '/activities'
  },
  {
    icon: 'fa-calendar-alt',
    title: 'Events',
    description: 'Join concerts, exhibitions, and festivals',
    route: '/events'
  },
  {
    icon: 'fa-utensils',
    title: 'Restaurants',
    description: 'Dine at the best-rated local places',
    route: '/restaurants'
  },
  {
    icon: 'fa-hotel',
    title: 'Logement',
    description: 'Find comfortable and trusted accommodations',
    route: '/accommodations'
  },
  {
    icon: 'fa-landmark',
    title: 'Monuments',
    description: 'Explore Tunisia s rich cultural heritage',
    route: '/monuments'
  },
  {
    icon: 'fa-users',
    title: 'Community',
    description: 'Share experiences, reviews, and stories',
    route: '/community'
  },
  {
    icon: 'fa-robot',
    title: 'AI Assistance',
    description: 'Get personalized suggestions with smart recommendations',
    route: '/ai-assistant'
  }
];
}
