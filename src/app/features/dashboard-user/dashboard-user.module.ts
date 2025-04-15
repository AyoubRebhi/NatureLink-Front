import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardUserRoutingModule } from './dashboard-user-routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LogementListUserComponent } from '../../features/logement/components/logement-list-user/logement-list-user.component';
import { LogementCreateUserComponent } from '../../features/logement/components/logement-create-user/logement-create-user.component'; // Import Create component
import { LogementModule } from '../../features/logement/logement/logement.module'; // 👈 import the module that exports components like LogementEdit
import { ReactiveFormsModule } from '@angular/forms'; // <-- Import this
import {LogementEditUserComponent} from '../../features/logement/components/logement-edit-user/logement-edit-user.component'; 
@NgModule({
  declarations: [
    LogementListUserComponent,
    LogementEditUserComponent,
  ],
  imports: [
    CommonModule,
    DashboardUserRoutingModule,
    RouterModule,
    ReactiveFormsModule, // <-- Add this here
    HttpClientModule,
    LogementModule,
  ],
})
export class DashboardUserModule {}
