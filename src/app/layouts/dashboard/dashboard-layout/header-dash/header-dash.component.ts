import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
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
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
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
  logout() {
    this.authService.logout();
    this.closeAllDropdowns();
    this.router.navigate(['/']);
  }

  private closeAllDropdowns() {
    this.showMessagesDropdown = false;
    this.showNotificationsDropdown = false;
    this.showProfileDropdown = false;
  }
}