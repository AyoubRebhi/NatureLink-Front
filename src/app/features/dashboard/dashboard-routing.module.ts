import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ReservationAllComponent } from '../reservation/components/reservation-all/reservation-all.component';
import { PackAddComponent } from '../pack/components/pack-add/pack-add.component';
import { PackListAComponent } from '../pack/components/pack-list-a/pack-list-a.component';
import { PackUpdateComponent } from '../pack/components/pack-update/pack-update.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'transport',
        loadChildren: () =>
          import('../transport/transport.module').then(m => m.TransportModule)
      },
      { path: 'reservations-all', component: ReservationAllComponent },
      { path: 'addpack', component: PackAddComponent },
{ path: 'list-admin', component: PackListAComponent },
  { path: 'update/:id', component: PackUpdateComponent }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
