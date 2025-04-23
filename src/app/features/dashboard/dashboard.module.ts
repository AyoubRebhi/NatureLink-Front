import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { HeaderDashComponent } from '../../layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { SidebarDashComponent } from '../../layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';
import { UserPaymentsComponent } from './pages/user-payments/user-payments.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DashboardComponent,
    DashboardLayoutComponent,
    HeaderDashComponent,
    SidebarDashComponent,
    UserPaymentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DashboardRoutingModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  exports: [
    DashboardLayoutComponent
  ]
})
export class DashboardModule {}