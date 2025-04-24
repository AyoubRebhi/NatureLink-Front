import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MonumentModule } from './monument/monument.module';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { HeaderDashComponent } from '../../layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { SidebarDashComponent } from '../../layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    HeaderDashComponent,
    SidebarDashComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RestaurantModule,
    MonumentModule,
    DashboardRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DashboardLayoutComponent]
})
export class DashboardModule { }
