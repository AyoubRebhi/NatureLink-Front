import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { HeaderDashComponent } from '../../layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { SidebarDashComponent } from '../../layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LogementModule } from '../logement/logement/logement.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
//import { NgChartsModule } from 'ng2-charts';
// Add these Material imports
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLayoutComponent,
    AdminDashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    HttpClientModule,
    LogementModule,
    SharedModule,
    MatTableModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    //NgChartsModule,
  ],
  exports: [
    DashboardLayoutComponent,
  ]
})
export class DashboardModule {}
