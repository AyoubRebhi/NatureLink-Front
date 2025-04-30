import { Component } from '@angular/core';

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

  toggleSubmenu(menu: string): void {
    this.submenus[menu] = !this.submenus[menu];
  }
}
