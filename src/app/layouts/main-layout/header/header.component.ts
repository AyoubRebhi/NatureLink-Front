import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/packages', label: 'Packages' },
    { path: '/contact', label: 'Contact' }
  ];

  currentRoute = '';
  pageTitle = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.setPageTitle();
      });
  }

  private setPageTitle() {
    const route = this.navLinks.find(link => this.currentRoute.includes(link.path));
    this.pageTitle = route ? route.label : this.currentRoute.split('/').pop() || '';
  }
}