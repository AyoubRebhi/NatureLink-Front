import { Component } from '@angular/core';
import { Role } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar-dash',
  templateUrl: './sidebar-dash.component.html',
  styleUrls: ['./sidebar-dash.component.scss']
})
export class SidebarDashComponent {
  submenus: { [key: string]: boolean } = {
    logement: false,
    activities: false,
    // Add more submenu keys here as needed
  };
  constructor(private authService: AuthService) {}


  toggleSubmenu(menu: string): void {
    this.submenus[menu] = !this.submenus[menu];
  }
  // Check if the current user has the PROVIDER role
  isProvider(): boolean {
    return this.authService.hasRole(Role.PROVIDER);
  }

  // Check if the current user has the AGENCE role
  isAgence(): boolean {
    return this.authService.hasRole(Role.AGENCE);
  }

  isAdmin(): boolean {
    return this.authService.hasRole(Role.ADMIN);
  }
}
