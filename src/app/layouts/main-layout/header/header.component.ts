import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PaymentService } from '../../../core/services/payment.service';
import { FaqChatbotService } from 'src/app/core/services/faq-chatbot.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentRoute = '';
  pageTitle = '';
  isAuthenticated = false;
  activeDropdown: string | null = null;
  chatOpen = false;
  userMessage = '';
  botReply = '';
  private routerSub!: Subscription;
  private authSub!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    public paymentService: PaymentService,
    private chatbotService: FaqChatbotService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updatePageTitle(event.urlAfterRedirects);
        this.closeDropdown();
        this.cdr.detectChanges();
      });

    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.cdr.detectChanges();
    });
  }

  updatePageTitle(url: string): void {
    const routeMap: { [key: string]: string } = {
      '/': 'Home',
      '/services': 'Services',
      '/logementsFront': 'Accommodations',
      '/activities': 'Activities',
      '/listD': 'Destinations',
      '/transports': 'Transports',
      '/packs/list-frontend': 'Packages',
      '/reservation/reservation-list': 'Reservations',
      '/postlist': 'Community',
      '/contact': 'Contact',
      '/profile': 'Profile'
    };
    
    this.pageTitle = routeMap[url.split('?')[0]] || 'Page';
  }

  toggleDropdown(dropdown: string): void {
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
    this.cdr.detectChanges();
  }

  closeDropdown(): void {
    this.activeDropdown = null;
    this.cdr.detectChanges();
  }

  scrollToFooter(): void {
    // If not on home page, navigate to home
    if (this.currentRoute !== '/') {
      this.router.navigate(['/']).then(() => {
        // Wait for navigation and DOM rendering
        setTimeout(() => {
          const footer = document.getElementById('main-footer');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.error('Footer element with ID "main-footer" not found.');
          }
        }, 300); // Increased delay for rendering
      });
    } else {
      // Already on home page, scroll directly
      const footer = document.getElementById('main-footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error('Footer element with ID "main-footer" not found.');
      }
    }
    this.closeDropdown();
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    
    this.chatbotService.sendMessage(this.userMessage).subscribe({
      next: (response) => {
        this.botReply = response.response;
        this.userMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.botReply = "Sorry, I couldn't process your request. Please try again.";
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeDropdown();
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.dropdown-toggle')) {
      this.closeDropdown();
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
