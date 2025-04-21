import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../layouts/main-layout/header/header.component'; // adjust path if needed
import { RouterModule } from '@angular/router';
import { HeaderDashComponent } from 'src/app/layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { SidebarDashComponent } from 'src/app/layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';



@NgModule({
  declarations: [HeaderComponent,
    HeaderDashComponent,
    SidebarDashComponent
  ],
  imports: [CommonModule,
    RouterModule],
  exports: [HeaderComponent,
    HeaderDashComponent,
    SidebarDashComponent
  ] // ✅ so others can use <app-header>
})
export class SharedModule {}
  