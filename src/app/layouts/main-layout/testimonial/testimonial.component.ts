import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent {
  testimonials = [
    {
      image: 'assets/img/testimonial-1.jpg',
      name: 'Sarah Johnson',
      location: 'London, UK',
      rating: 5,
      comment: 'The event management service was exceptional! They handled everything perfectly for our corporate retreat.'
    },
    {
      image: 'assets/img/testimonial-2.jpg',
      name: 'Michael Chen',
      location: 'Toronto, Canada',
      rating: 4,
      comment: 'Finding accommodations through this service saved us so much time and stress. Highly recommended!'
    },
    {
      image: 'assets/img/testimonial-3.jpg',
      name: 'Emma Rodriguez',
      location: 'Madrid, Spain',
      rating: 5,
      comment: 'The transportation options were reliable and affordable. Made our vacation so much smoother.'
    },
    {
      image: 'assets/img/testimonial-4.jpg',
      name: 'David Kim',
      location: 'Seoul, South Korea',
      rating: 5,
      comment: 'Our travel guide was knowledgeable and showed us hidden gems we would never have found on our own.'
    }
  ];
}
