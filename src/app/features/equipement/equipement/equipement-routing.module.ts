import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipementListComponent } from '../equipement-list/equipement-list.component';
import { EquipementAddComponent } from '../equipement-add/equipement-add.component'; // Import the form component

const routes: Routes = [
  { path: '', component: EquipementListComponent },
  { path: 'add', component: EquipementAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipementRoutingModule {}
