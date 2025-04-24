import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-dash',
  templateUrl: './sidebar-dash.component.html',
  styleUrls: ['./sidebar-dash.component.scss']
})
export class SidebarDashComponent {
  submenus: { [key: string]: boolean } = {
    activities: false,
    monuments: false,
    restaurant: false,
    visit: false
  };


  toggleSubmenu(menu: string) {
    this.submenus[menu] = !this.submenus[menu];
  }
}
