// src/app/features/reservation/reservation.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReservationCreateComponent } from './components/reservation-create/reservation-create.component';
import { ReservationUpdateComponent } from './components/reservation-update/reservation-update.component';
import { ReservationAllComponent } from './components/reservation-all/reservation-all.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ReservationRoutingModule } from './reservation-routing.module';
import { HeaderDashComponent } from 'src/app/layouts/dashboard/dashboard-layout/header-dash/header-dash.component';
import { SidebarDashComponent } from 'src/app/layouts/dashboard/dashboard-layout/sidebar-dash/sidebar-dash.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ReservationCreateComponent,
    ReservationUpdateComponent,
    ReservationAllComponent,
   
    ReservationListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ReservationRoutingModule, 
    NgbModule,
    
    SharedModule // Import the SharedModule here
    // Only import the routing module specific to this feature
  ],
  exports: [
    ReservationCreateComponent,
    ReservationUpdateComponent,
    ReservationAllComponent,
    ReservationListComponent
  ]
})
export class ReservationModule {}
