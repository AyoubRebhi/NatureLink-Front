import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { LogementListComponent } from '../../features/logement/components/logement-list/logement-list.component';
import { LogementCreateComponent } from '../../features/logement/components/logement-create/logement-create.component'; // Import Create component
// Import UnitCreateComponent
import { EquipementListComponent } from '../equipement/equipement-list/equipement-list.component';
import { EquipementAddComponent } from '../equipement/equipement-add/equipement-add.component';
import { LogementEditComponent } from '../logement/components/logement-edit/logement-edit.component';
import { EquipementEditComponent } from '../equipement/equipement-edit/equipement-edit.component';
// Import the form component
const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'logement/list', component: LogementListComponent },
      { path: 'logement/add', component: LogementCreateComponent },
      {
        path: 'logement/edit/:id',
        component: LogementEditComponent
      },
      {path: 'equipement/list', component:EquipementListComponent}, 
      {path: 'equipement/add', component:EquipementAddComponent},
      {path: 'equipement/edit/:id', component:EquipementEditComponent},

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
