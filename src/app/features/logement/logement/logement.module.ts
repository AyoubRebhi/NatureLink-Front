import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogementListComponent } from '../components/logement-list/logement-list.component';
import { LogementCreateComponent } from '../components/logement-create/logement-create.component';
import { LogementEditComponent } from '../components/logement-edit/logement-edit.component';
import { LogementService } from 'src/app/core/services/logement.service'; // Updated import path
import { ReactiveFormsModule } from '@angular/forms';
import { LogementRoutingModule } from './logement-routing.module';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule } from '@angular/forms';
import { LogementCreateUserComponent } from '../components/logement-create-user/logement-create-user.component'; 
import { LogementDetailBackComponent } from '../components/logement-detail-back/logement-detail-back.component';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    LogementListComponent,
    LogementCreateComponent,
    LogementEditComponent,
    LogementCreateUserComponent,
    LogementDetailBackComponent
  ],
  imports: [
    CommonModule,
    LogementRoutingModule,
    ReactiveFormsModule,
    HttpClientModule ,
    FormsModule,
    NgChartsModule
    
  ],

  providers: [LogementService],
})
export class LogementModule {}
