import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
  isControlSidebarOpen = false;

  toggleControlSidebar() {
    this.isControlSidebarOpen = !this.isControlSidebarOpen;
  }
}