import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // Array of navigation links
  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/packages', label: 'Packages' },
    { path: '/contact', label: 'Contact' },
    { path: '/reservation/create', label: 'Create Reservation' }
  ];

  currentRoute = '';
  pageTitle = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.updatePageTitle(event.url);
      });
  }

  // Dynamically updates the page title based on the current route
  private updatePageTitle(route: string): void {
    const routeTitles: { [key: string]: string } = {
      '/': 'Home',
      '/about': 'About',
      '/services': 'Services',
      '/packages': 'Packages',
      '/contact': 'Contact',
      '/reservation/create': 'Create Reservation',
    };

    // Check if the current route matches any predefined path
    const routeObj = this.navLinks.find(link => route.includes(link.path));
    this.pageTitle = routeTitles[route] || (routeObj ? routeObj.label : 'Page');
  }
}
