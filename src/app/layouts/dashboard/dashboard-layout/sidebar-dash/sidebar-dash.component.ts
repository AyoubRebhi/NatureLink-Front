import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-sidebar-dash',
  templateUrl: './sidebar-dash.component.html',
  styleUrls: ['./sidebar-dash.component.scss']
})
export class SidebarDashComponent {
  submenus = {
    activities: false,
    packs: false
  };
  currentUser: User | null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue || null;
  }

  toggleSubmenu(menu: 'activities' | 'packs') {
    this.submenus[menu] = !this.submenus[menu];
  }
}