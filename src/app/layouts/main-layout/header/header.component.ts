import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PaymentService } from '../../../core/services/payment.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/packages', label: 'Packages' },
    { path: '/activities', label: 'Activities' },
    { path: '/contact', label: 'Contact' }
  ];

  currentRoute = '';
  pageTitle = '';
  isAuthenticated = false;
  currentUser: User | null = null;
  private authSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    public paymentService: PaymentService
  ) {
    this.isAuthenticated = !!this.authService.currentUserValue;
    this.currentUser = this.authService.currentUserValue;
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updatePageTitle();
      });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private updatePageTitle() {
    const routeTitles: { [key: string]: string } = {
      '/': 'Home',
      '/about': 'About',
      '/services': 'Services',
      '/packages': 'Packages',
      '/activities': 'Activities',
      '/contact': 'Contact',
      '/profile': 'Profile',
      '/payments': 'Payments',
      '/auth/login': 'Login',
      '/auth/register': 'Register',
      '/reservation/create': 'Create Reservation'
    };

    this.pageTitle = routeTitles[this.currentRoute] || 
      this.navLinks.find(link => this.currentRoute.includes(link.path))?.label || 
      this.currentRoute.split('/').pop() || 'NatureLink';
  }
}