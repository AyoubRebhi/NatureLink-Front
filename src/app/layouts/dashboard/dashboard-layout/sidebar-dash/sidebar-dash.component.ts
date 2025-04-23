import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-dash',
  templateUrl: './sidebar-dash.component.html',
  styleUrls: ['./sidebar-dash.component.scss']
})
export class SidebarDashComponent {
  submenus = {
    activities: false
    // Add more submenus here as needed
  };

  toggleSubmenu(menu: 'activities') {
    this.submenus[menu] = !this.submenus[menu];
  }}