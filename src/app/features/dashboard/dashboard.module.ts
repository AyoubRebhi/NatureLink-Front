import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { HeaderDashComponent } from '../../layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidebarDashComponent } from '../../layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserPaymentsComponent } from './pages/user-payments/user-payments.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DashboardComponent,
    DashboardLayoutComponent,
    SidebarDashComponent,
    HeaderDashComponent,
    UserPaymentsComponent
  ],
  imports: [
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule,
    DashboardRoutingModule
  ],
  exports: [
    DashboardLayoutComponent
  ]
})
export class DashboardModule {}