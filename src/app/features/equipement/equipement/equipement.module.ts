import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipementRoutingModule } from './equipement-routing.module';
import { EquipementListComponent } from '../equipement-list/equipement-list.component';
import { EquipementAddComponent } from '../equipement-add/equipement-add.component';   // Add component
import { EquipementService } from 'src/app/core/services/equipement.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel binding
import { EquipementEditComponent } from '../equipement-edit/equipement-edit.component';

@NgModule({
  declarations: [
    EquipementListComponent,
    EquipementAddComponent ,
    EquipementEditComponent // Declare the Add component
  ],
  imports: [
    CommonModule,
    EquipementRoutingModule,
    FormsModule  // Import FormsModule here
  ],
  providers: [EquipementService],
})
export class EquipementModule {}
