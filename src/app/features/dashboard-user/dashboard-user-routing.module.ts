import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogementListUserComponent } from '../../features/logement/components/logement-list-user/logement-list-user.component';
import { LogementCreateUserComponent } from '../../features/logement/components/logement-create-user/logement-create-user.component'; // Import Create component
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { LogementEditUserComponent } from '../logement/components/logement-edit-user/logement-edit-user.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'list', component: LogementListUserComponent },
      { path: 'create', component: LogementCreateUserComponent },
      { path: 'edit/:id', component: LogementEditUserComponent }, // Add this route for logement edit
      
      // you can add more routes here
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardUserRoutingModule {}
