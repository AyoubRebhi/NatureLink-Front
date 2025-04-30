import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FaqChatbotService } from 'src/app/core/services/faq-chatbot.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Chatbot properties
  userMessage: string = '';
  botReply: string = '';

  // Navigation and authentication properties
  currentRoute = '';
  pageTitle = '';
  isAuthenticated = false;
  currentUser: User | null = null;
  private authSubscription!: Subscription;

  // Navigation links
  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/packages', label: 'Packages' },
    { path: '/contact', label: 'Contact' },
    { path: '/reservation/create', label: 'Create Reservation' }
  ];

  constructor(
    private router: Router,
    private faqChatbotService: FaqChatbotService,
    private authService: AuthService,
    public paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.setupRouteTracking();
    this.setupAuthSubscription();
  }

  private setupRouteTracking(): void {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.updatePageTitle(event.url);
      });
  }

  private setupAuthSubscription(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
    });
  }

  // Chatbot functionality
  sendMessage(): void {
    if (!this.userMessage.trim()) {
      return;
    }

    this.faqChatbotService.sendMessage(this.userMessage).subscribe({
      next: (response) => {
        this.botReply = response.response; // Flask returns {"response": "..."}
        this.userMessage = ''; // Clear input after sending
      },
      error: (err) => {
        console.error('Error talking to chatbot', err);
        this.botReply = 'Sorry, there was a problem contacting the assistant.';
      }
    });
  }

  // Navigation and title handling
  private updatePageTitle(route: string): void {
    const routeTitles: { [key: string]: string } = {
      '/': 'Home',
      '/about': 'About',
      '/services': 'Services',
      '/packages': 'Packages',
      '/contact': 'Contact',
      '/reservation/create': 'Create Reservation',
    };

    const routeObj = this.navLinks.find(link => route.includes(link.path));
    this.pageTitle = routeTitles[route] || (routeObj ? routeObj.label : 'Page');
  }

  // Authentication
  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}