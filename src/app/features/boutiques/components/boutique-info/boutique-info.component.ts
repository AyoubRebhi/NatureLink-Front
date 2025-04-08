import { Component } from '@angular/core';

@Component({
  selector: 'app-boutique-info',
  templateUrl: './boutique-info.component.html',
  styleUrls: ['./boutique-info.component.scss']
})
export class BoutiqueInfoComponent {
  products = [
    {
      name: 'Incidid Tongue Bar',
      price: 81.0,
      originalPrice: 89.0,
      discount: 9,
      offre:'limited',
      image: 'assets/img/package-1.jpg'
    },
    {
      name: 'Incidid Tongue Bar',
      price: 81.0,
      originalPrice: 90.0,
      discount: 10,
      offre:'Available',
      image: 'assets/img/package-1.jpg'
    },
    {
      name: 'Incidid Tongue Bar',
      price: 81.0,
      originalPrice: 89.0,
      discount: 9,
      offre:'limited',
      image: 'assets/img/package-1.jpg'
    },
    {
      name: 'Incidid Tongue Bar',
      price: 81.0,
      originalPrice: 85.0,
      discount: 5,
      offre:'limited',
      image: 'assets/img/package-1.jpg'
    }
  ];
  articles = [
    {
      image: 'assets/img/package-2.jpg',
      day: '25',
      month: 'Jun',
      title: 'There Are Many Variations Of Passages Of Lorem Ipsum Available',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s,...'
    },
    {
      image: 'assets/img/package-2.jpg',
      day: '25',
      month: 'Jun',
      title: 'Product 3',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s,...'
    },
    {
      image: 'assets/img/package-2.jpg',
      day: '25',
      month: 'Jun',
      title: 'Product 4',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s,...'
    }
  ];
}
