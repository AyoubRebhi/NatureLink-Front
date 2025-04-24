// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../layouts/main-layout/header/header.component';
import { HeaderDashComponent } from '../layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { SidebarDashComponent } from '../layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderDashComponent,
    SidebarDashComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    HeaderDashComponent,
    SidebarDashComponent
  ]
})
export class SharedModule {}
