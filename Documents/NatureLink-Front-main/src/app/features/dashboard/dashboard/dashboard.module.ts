// src/app/features/dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { HeaderDashComponent } from '../../layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { SidebarDashComponent } from '../../layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';
import { RestaurantModule } from '../restaurant/restaurant.module';  // Assure-toi que RestaurantModule est importé ici

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    HeaderDashComponent,
    SidebarDashComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RestaurantModule,  // RestaurantModule pour gérer la liste des restaurants
    DashboardRoutingModule
  ],
  exports: [
    DashboardLayoutComponent
  ]
})
export class DashboardModule {}
