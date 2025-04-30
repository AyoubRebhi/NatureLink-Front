import { Component, OnInit } from '@angular/core';
import { PackService } from 'src/app/core/services/pack.service';
import { PackDTO } from 'src/app/core/models/pack.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bestPack: PackDTO | null = null;
  showPopup: boolean = false; // Controls popup visibility
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
    }
  ];
  teamMembers = [
    {
      name: "John Doe",
      designation: "Senior Tour Guide",
      image: "assets/img/team-1.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Jane Smith",
      designation: "Adventure Specialist",
      image: "assets/img/team-2.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Robert Brown",
      designation: "Cultural Expert",
      image: "assets/img/team-3.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Emily Johnson",
      designation: "Wildlife Guide",
      image: "assets/img/team-4.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    }
  ];
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
      title: 'Activity Reservation',
      description: 'Book exciting activities and experiences for your trip with ease.',
      route: '/activities'
    }
  ];

  constructor(private packService: PackService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBestPack();
    // Show popup after 2 seconds
    setTimeout(() => {
      this.showPopup = true;
    }, 2000);
  }

  fetchBestPack(): void {
    this.packService.getAllPacks().subscribe({
      next: (packs) => {
        Promise.all(
          packs.map((pack) =>
            this.packService.getAverageRating(pack.id!).toPromise().then((rating) => {
              pack.averageRating = rating || 0;
              return pack;
            })
          )
        ).then((packsWithRatings) => {
          this.bestPack = packsWithRatings.reduce((prev, curr) =>
            (prev.averageRating || 0) > (curr.averageRating || 0) ? prev : curr
          );
        });
      },
      error: (error) => {
        console.error('Error fetching packs:', error);
      }
    });
  }

  navigateToPacks(): void {
    if (this.bestPack) {
      this.router.navigate(['/packs/list-frontend'], {
        queryParams: { highlightPackId: this.bestPack.id }
      });
    }
  }

  closePopup(event: Event): void {
    event.stopPropagation(); // Prevent triggering navigateToPacks
    this.showPopup = false; // Hide the popup
  }
}