import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  packages = [
    {
      id: 1,
      destination: 'Paris, France',
      duration: '5 Days',
      persons: '2 Persons',
      price: '$999',
      rating: 5,
      image: 'assets/img/package-1.jpg',
      description: 'Explore the romantic city of Paris.'
    },
  {
      id: 2,
      destination: 'Tokyo, Japan',
      duration: '7 Days',
      persons: '3 Persons',
      price: '$1299',
      rating: 4,
      image: 'assets/img/package-2.jpg',
      description: 'Experience the vibrant culture of Tokyo.'
    },
    {
      id: 3,
      destination: 'Sydney, Australia',
      duration: '10 Days',
      persons: '4 Persons',
      price: '$1599',
      rating: 5,
      image: 'assets/img/package-3.jpg',
      description: 'Relax on the beautiful beaches of Sydney.'
    }]
}
