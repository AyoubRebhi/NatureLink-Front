import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { HeaderDashComponent } from '../../layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidebarDashComponent } from '../../layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';
import { LogementModule } from '../logement/logement/logement.module'; 
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLayoutComponent,
    SidebarDashComponent,
    HeaderDashComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    LogementModule,
    HttpClientModule,
    NgChartsModule,

  ],
  exports: [
    DashboardLayoutComponent
  ]
})
export class DashboardModule {}