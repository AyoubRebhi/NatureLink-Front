import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-sidebar-dash',
  templateUrl: './sidebar-dash.component.html',
  styleUrls: ['./sidebar-dash.component.scss']
})
export class SidebarDashComponent {
  submenus = { activities: false };
  currentUser: User;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue!;
  }

  toggleSubmenu(menu: 'activities') {
    this.submenus[menu] = !this.submenus[menu];
  }
}