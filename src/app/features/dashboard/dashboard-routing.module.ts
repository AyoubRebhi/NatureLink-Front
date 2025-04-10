import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { LogementListComponent } from '../../features/logement/components/logement-list/logement-list.component';
import { LogementCreateComponent } from '../../features/logement/components/logement-create/logement-create.component'; // Import Create component
import { UnitListComponent } from '../../features/unit/components/unit-list/unit-list.component'; // Import UnitListComponent
import { UnitCreateComponent } from '../../features/unit/components/unit-create/unit-create.component'; // Import UnitCreateComponent
import { EquipementListComponent } from '../equipement/equipement-list/equipement-list.component';
import { EquipementAddComponent } from '../equipement/equipement-add/equipement-add.component';
import { DisponibilityListComponent } from '../disponibility/disponibility-list/disponibility-list.component'; 
import { DisponibilityAddComponent } from '../disponibility/disponibility-add/disponibility-add.component'; // Import the form component
const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'logement/list', component: LogementListComponent },
      { path: 'logement/add', component: LogementCreateComponent },
      // Add the unit routes here
      { path: 'unit/list', component: UnitListComponent },
      { path: 'unit/add/:logementId', component: UnitCreateComponent },
      {path: 'equipement/list', component:EquipementListComponent}, // Add a unit to a specific logement
      {path: 'equipement/add', component:EquipementAddComponent} ,// Add a unit to a specific logement
      { path: 'disponibility/list', component: DisponibilityListComponent },
      { path: 'disponibility/add/:logementId', component: DisponibilityAddComponent },  // New route to add disponibility


    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
