import { Component } from '@angular/core';

@Component({
  selector: 'app-header-dash',
  templateUrl: './header-dash.component.html',
  styleUrls: ['./header-dash.component.scss']
})
export class HeaderDashComponent {
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

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}