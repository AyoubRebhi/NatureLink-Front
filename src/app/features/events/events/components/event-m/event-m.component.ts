import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-m',
  templateUrl: './event-m.component.html',
  styleUrls: ['./event-m.component.scss']
})
export class EventMComponent implements OnInit {
isAdminView=false;
showMessagesDropdown = false;
  showNotificationsDropdown = false;
  showProfileDropdown = false;
  mobileMenuOpen = false;

  toggleDropdown(type: string) {
    this.showMessagesDropdown = false;
    this.showNotificationsDropdown = false;
    this.showProfileDropdown = false;

    switch(type) {
      case 'messages':
        this.showMessagesDropdown = !this.showMessagesDropdown;
        break;
      case 'notifications':
        this.showNotificationsDropdown = !this.showNotificationsDropdown;
        break;
      case 'profile':
        this.showProfileDropdown = !this.showProfileDropdown;
        break;
    }
  }

constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.isAdminView = data['adminView'] || false;
    });
    // Check if current route contains 'admin'
    
    
  }
}
