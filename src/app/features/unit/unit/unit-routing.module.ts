import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitListComponent } from '../components/unit-list/unit-list.component';
import { UnitCreateComponent } from '../components/unit-create/unit-create.component';

const routes: Routes = [
  { path: 'list', component: UnitListComponent },
  { path: 'add/:logementId', component: UnitCreateComponent }, // Add unit for specific logement
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitRoutingModule {}
