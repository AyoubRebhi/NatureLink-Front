import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-dash',
  templateUrl: './sidebar-dash.component.html',
  styleUrls: ['./sidebar-dash.component.scss']  // Ensure correct relative path
})
export class SidebarDashComponent {
  submenus: { [key: string]: boolean } = {
    logement: false,
    activities: false,
  };

  toggleSubmenu(menu: string): void {
    this.submenus[menu] = !this.submenus[menu];
  }
}
