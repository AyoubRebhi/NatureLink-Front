import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FaqChatbotService } from 'src/app/core/services/faq-chatbot.service'; // << IMPORT THIS

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userMessage: string = '';
  botReply: string = '';

  currentRoute = '';
  pageTitle = '';

  constructor(private router: Router,
              private faqChatbotService: FaqChatbotService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.updatePageTitle(event.url);
      });
  }

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

  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/packages', label: 'Packages' },
    { path: '/contact', label: 'Contact' },
    { path: '/reservation/create', label: 'Create Reservation' }
  ];
}
