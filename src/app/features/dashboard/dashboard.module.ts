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
//import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    HttpClientModule,
    LogementModule,
    SharedModule,
    //NgChartsModule,
  ],
  exports: [
    DashboardLayoutComponent,
  ]
})
export class DashboardModule {}
